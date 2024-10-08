import axios, { AxiosInstance } from 'axios';

interface ServerLimits {
    memory: number;  // RAM allocation in MB
    swap: number;
    disk: number;
    io: number;
    cpu: number;
}
// Define types for the Pterodactyl API response
interface Server {
    id: string;
    name: string;
    memory_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
    state: string;
    limits: ServerLimits;
    // Add other properties as needed
}

interface ServerResources {
    memory_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
}

class PterodactylClient {
    private apiKey: string;
    private apiUrl: string;
    private API_user_key: string;
    private client: AxiosInstance;
    private client_two: AxiosInstance

    constructor(apiKey: string, API_user_key: string, apiUrl: string = 'https://your-pterodactyl-url.com/api') {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.API_user_key = API_user_key

        this.client = axios.create({
            baseURL: this.apiUrl,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
        });

        this.client_two = axios.create({
            baseURL: this.apiUrl,
            headers: {
                'Authorization': `Bearer: ${this.API_user_key}`,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        });
    }

    // Example method to fetch a list of servers
    async getServerResources(serverId: number): Promise<Server> {
        try {
            const response = await this.client.get(`/client/servers/${serverId}/resources`);
            return response.data.attributes.resources;
        } catch (error) {
            console.error('Error fetching server resources:', error);
            throw error;
        }
    }

    async getServerDetails(uuid: string): Promise<Server> {
        try {
            const response = await this.client.get(`/application/servers/${uuid}`, {
                params: { include: 'allocations' },
            });
            return response.data.attributes;
        } catch (error) {
            console.error('Error fetching server details:', error);
            throw error;
        }
    }

    async getServerResourceUsage(serverId: string): Promise<ServerResources> {
        try {
            
            const response = await this.client_two.get(`/client/servers/${serverId}/resources`, {
                params: { include: 'allocations' },
            });
            return response.data.attributes.resources;
        } catch (error) {
            console.error('Error fetching server details:', error);
            throw error;
        }
    }

    // Add more methods as needed to interact with other endpoints
}

export default PterodactylClient;
