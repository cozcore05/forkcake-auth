import axios, { type AxiosInstance, type AxiosResponse, type AxiosRequestConfig } from "axios"
import router from "../router"
import { toast } from "@/utils/toast"
import { LucideSettings } from "lucide-vue-next";


// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Important for cookies/CSRF
})

api.interceptors.response.use((response: AxiosResponse<any>) => {

  const data = response.data.data;

  if (Array.isArray(data)) {
    data.forEach((project: any) => {
      if (project.sale_date) {
        project.sale_date = new Date(project.sale_date).toISOString().split('T')[0];
      }
      if (project.end_date) {
        project.end_date = new Date(project.end_date).toISOString().split('T')[0];
      }
    });
  } else if (data && typeof data === 'object') {
    if (data.sale_date) {
      data.sale_date = new Date(data.sale_date).toISOString().split('T')[0];
    }
    if (data.end_date) {
      data.end_date = new Date(data.end_date).toISOString().split('T')[0];
    }
  }



  return response;
}, (error: any) => {
  return Promise.reject(error);
});


// Debug flag - set to false in production
const DEBUG = false

// Use your actual backend URL here
export const BASE_URL = import.meta.env.VITE_APP_URL 

// Base URL for assets - IMPORTANT: This must match your actual server setup
export const APP_URL = import.meta.env.VITE_APP_URL 

// Helper function to get full image URL - FIXED VERSION
// Helper function to get full image URL
// Helper function to get full image URL
export const getFullImageUrl = (path: string, size?: string): string => {
  if (!path) return ""

  // Add the size parameter only if it's provided, without the leading '?' for internal use
  const sizeParam = size ? `size=${size}` : ''

  // Split the comma-separated URLs and process each one
  const urls = path.split(",")

  // Function to safely append a query parameter (internal helper)
  const safeAppendSize = (u: string) => {
    if (!sizeParam) return u;
    const separator = u.includes('?') ? '&' : '?';
    return u + separator + sizeParam;
  }
  
  // Process each URL individually
  return urls
    .map((url) => {
      // Trim any extra whitespace from the URL
      const trimmedUrl = url.trim()
      
      // 1. If it's already a base64 data URI, return as is
      if (trimmedUrl.startsWith("data:")) {
        return trimmedUrl
      }

      // 2. Handle Full URLs (http/https)
      if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
        let finalUrl = trimmedUrl;

        // CHANGE 2: Remove hardcoded "api.forkcake.com"
        const prodDomain = import.meta.env.VITE_PROD_API_DOMAIN;
        
        // Only replace if the env var exists and matches
        if (prodDomain && finalUrl.includes(prodDomain)) {
           finalUrl = finalUrl.replace("http://", "https://");
        }

        // Apply size parameter safely, regardless of production/localhost origin
        return safeAppendSize(finalUrl);
      }

      // 3. Handle Relative Paths (Constructing the URL)
      
      // Clean up the path - remove any leading slashes
      const cleanPath = trimmedUrl.replace(/^\/+/, "")
      
      // Ensure the Base URL has no trailing slash to prevent double slashes
      const baseUrl = APP_URL.replace(/\/+$/, "") 

      // Function to append base URL and size param
      const buildFinalUrl = (p: string) => safeAppendSize(`${baseUrl}/${p}`);


      // CASE A: Path already starts with 'public/'
      if (cleanPath.startsWith("public/")) {
        const finalUrl = buildFinalUrl(cleanPath)
        if (DEBUG) console.log(`✅ Path already has public/, using: ${finalUrl}`)
        return finalUrl
      }

      // CASE B: Path starts with 'storage/'
      if (cleanPath.startsWith("storage/")) {
        const finalUrl = buildFinalUrl(cleanPath)
        if (DEBUG) console.log(`✅ Storage path, using: ${finalUrl}`)
        return finalUrl
      }

      // CASE C: Specific folder detection (Your custom logic)
      const filename = cleanPath.split("/").pop()

      if (cleanPath.includes("investors/") || cleanPath.includes("investor")) {
        const finalUrl = buildFinalUrl(`public/investors/${filename}`)
        if (DEBUG) console.log(`✅ Investor image, using: ${finalUrl}`)
        return finalUrl
      }

      if (cleanPath.includes("projects/") || cleanPath.includes("project")) {
        const finalUrl = buildFinalUrl(`public/projects/${filename}`)
        if (DEBUG) console.log(`✅ Project image, using: ${finalUrl}`)
        return finalUrl
      }

      if (cleanPath.includes("banners/") || cleanPath.includes("banner")) {
        const finalUrl = buildFinalUrl(`public/banners/${filename}`)
        if (DEBUG) console.log(`✅ Banner image, using: ${finalUrl}`)
        return finalUrl
      }

      if (cleanPath.includes("chains/") || cleanPath.includes("chain")) {
        const finalUrl = buildFinalUrl(`public/chains/${filename}`)
        if (DEBUG) console.log(`✅ Chain image, using: ${finalUrl}`)
        return finalUrl
      }

      if (cleanPath.includes("launchpads/") || cleanPath.includes("launchpad")) {
        const finalUrl = buildFinalUrl(`public/launchpads/${filename}`)
        if (DEBUG) console.log(`✅ Launchpad image, using: ${finalUrl}`)
        return finalUrl
      }

      // CASE D: Filename only (Assume project folder)
      if (!cleanPath.includes("/")) {
        const extension = cleanPath.split(".").pop()?.toLowerCase()
        if (extension && ["jpg", "jpeg", "png", "webp", "svg", "gif"].includes(extension)) {
          const finalUrl = buildFinalUrl(`public/projects/${cleanPath}`)
          if (DEBUG) console.log(`✅ Filename only, assuming project: ${finalUrl}`)
          return finalUrl
        }
      }

      // CASE E: Special Assets
      if (cleanPath.startsWith("logos/")) {
        const finalUrl = buildFinalUrl(`storage/${cleanPath}`);
        if (DEBUG) console.log(`✅ Public asset path (e.g. logos), using: ${finalUrl}`);
        return finalUrl;
      }

      if (cleanPath === "logo.svg" || cleanPath.startsWith("logo.svg")) {
        const finalUrl = buildFinalUrl(cleanPath); 
        if (DEBUG) console.log('✅ Public root asset (logo.svg), using:', finalUrl); 
        return finalUrl; 
      }

      // Default Fallback: assume it needs public prefix
      const finalUrl = buildFinalUrl(`public/${cleanPath}`)
      if (DEBUG) console.log(`✅ Default case, using: ${finalUrl}`)
      return finalUrl
    })
    .join(", ") // Join back into string
}

// Add a request interceptor to include auth token in requests and add timestamp
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }

    // Add timestamp to prevent caching
    if (!config.params) {
      config.params = {}
    }
    config.params._t = Date.now()

    // Log request details if debug is enabled
    if (DEBUG) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config)
    }

    return config
  },
  (error) => {
    if (DEBUG) {
      console.error("API Request Error:", error)
    }
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle common errors and log responses
api.interceptors.response.use(
  (response) => {
    // Log response if debug is enabled
    if (DEBUG) {
      console.log(`API Response: ${response.status} ${response.config.url}`, response.data)
    }

    // Process image URLs in the response data
    if (response.data && typeof response.data === "object") {
      processImageUrls(response.data)
    }

    return response
  },
  (error) => {
    // Log error if debug is enabled
    if (DEBUG) {
      console.error("API Response Error:", error.response || error)
    }

    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Clear token
      localStorage.removeItem("token")

      // Only redirect to login if we're not already on the login page
      if (router.currentRoute.value.name !== "Login") {
        router.push("/login")
      }
    }

    // Handle 403 Forbidden errors (insufficient permissions)
    if (error.response && error.response.status === 403) {
      console.error(`Permission denied: ${error.config.url}`)
      // Redirect to home or show permission denied message
      if (!router.currentRoute.value.path.includes("/login")) {
        router.push("/")
      }
    }

    // Handle 404 Not Found errors with more detailed logging
    if (error.response && error.response.status === 404) {
      console.error(`Resource not found: ${error.config.url}`)
    }

    // Handle 500 Server errors
    if (error.response && error.response.status >= 500) {
      console.error(`Server error: ${error.response.status} ${error.config.url}`)
    }

    return Promise.reject(error)
  },
)

// Process image URLs in response data
function processImageUrls(data: any) {
  if (!data) return

  // Process arrays
  if (Array.isArray(data)) {
    data.forEach((item) => processImageUrls(item))
    return
  }

  // Process objects
  if (typeof data === "object") {
    // Image fields to process
    const imageFields = [
      "logo",
      "logo_url",
      "logoUrl",
      "banner",
      "banner_url",
      "bannerUrl",
      "image",
      "image_url",
      "imageUrl",
      "avatar",
      "avatar_url",
      "avatarUrl",
      "thumbnail",
      "thumbnail_url",
      "thumbnailUrl",
      "icon",
      "icon_url",
      "iconUrl",
    ]

    for (const key in data) {
      if (imageFields.includes(key) && typeof data[key] === "string" && data[key]) {
        // Skip base64 images - they're already complete
        if (data[key].startsWith("data:")) {
          continue
        }

        // Convert relative URLs to absolute URLs
        const originalUrl = data[key]
        data[key] = getFullImageUrl(data[key])
        if (DEBUG && originalUrl !== data[key]) {
          console.log(`Processed image URL: ${originalUrl} -> ${data[key]}`)
        }
      } else if (typeof data[key] === "object" && data[key] !== null) {
        // Recursively process nested objects
        processImageUrls(data[key])
      }
    }
  }
}

// Define the ApiService class
class ApiService {
  private axiosInstance: AxiosInstance

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get(url, config).then((response) => response.data)
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post(url, data, config).then((response) => response.data)
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put(url, data, config).then((response) => response.data)
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete(url, config).then((response) => response.data)
  }

  // Add this method for banner image uploads
  uploadBannerImage(formData: FormData) {
    return this.post("/admin/projects/upload-banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    })
  }

  // Add this method for logo image uploads
  uploadLogoImage(formData: FormData) {
    return this.post("/admin/projects/upload-logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }
}

// Instantiate ApiService with the configured axios instance
const apiServiceInstance = new ApiService(api)

// ICO API Service
const icoService = {
  // Image URL helper
  getImageUrl: getFullImageUrl,

  // Generic get method for flexibility
  get(endpoint: string, params = {}) {
    return api.get(endpoint, { params })
  },

  post(endpoint: string, data?: any) {
    return api.post(endpoint, data);
  },

  // ===== PUBLIC ENDPOINTS =====
  // ADD THESE METHODS TO YOUR EXISTING icoService object in api.ts

  // ===== CONFIG ENDPOINTS - OPTIMIZED =====

  // Get footer configuration
  getFooterConfig(params = {}) {
    if (DEBUG) console.log("API: Fetching footer configuration")
    return api.get("/config/footer", { params })
  },

  // to call the cache clearing API endpoint without repeating the URL.
  clearAdminCache() {
    if (DEBUG) console.log('API: Clearing all application cache');
    return api.post('/admin/cache/clear');
  },

  // Get configuration by group
  getConfigByGroup(group: string, params = {}) {
    if (DEBUG) console.log(`API: Fetching config for group: ${group}`)
    return api.get(`/config/group/${group}`, { params })
  },

  // Update single configuration (existing method)
  updateConfig(configData: any) {
    if (DEBUG) console.log("API: Updating configuration", configData)
    return api.post("/config/update", configData)
  },

  // NEW: Batch update multiple configurations (OPTIMIZED)
  batchUpdateConfig(configs: Array<{ key: string, value: any, type: string, group?: string }>) {
    if (DEBUG) console.log("API: Batch updating configurations", configs.length, "items")
    return api.post("/config/batch-update", { configs })
  },

  // Get all configurations with filtering and pagination
  getAllConfigs(params = {}) {
    if (DEBUG) console.log("API: Fetching all configurations")
    return api.get("/config/all", { params })
  },

  // Delete configuration
  deleteConfig(key: string) {
    if (DEBUG) console.log(`API: Deleting configuration: ${key}`)
    return api.delete(`/config/${key}`)
  },

  // Toggle configuration active status
  toggleConfig(key: string) {
    if (DEBUG) console.log(`API: Toggling configuration: ${key}`)
    return api.patch(`/config/${key}/toggle`)
  },


  // Projects - Public Read Operations
  getProjects(params = {}) {
    return api.get("/projects", { params })
  },

  getHomeProjects(params = {}) {
    if (DEBUG) console.log("API: Fetching minimal home projects")
    return api.get("/projects/home", { params })
  },

  getMinimalActiveProjects(params = {}) {
    return api.get("/projects/min/active", { params })
  },

  getMinimalUpcomingProjects(params = {}) {
    return api.get("/projects/min/upcoming", { params })
  },

  getMinimalEndedProjects(params = {}) {
    return api.get("/projects/min/ended", { params })
  },

  getActiveProjects(params = {}) {
    return api.get("/projects/status/active", { params })
  },

  getUpcomingProjects(params = {}) {
    return api.get("/projects/status/upcoming", { params })
  },

  getEndedProjects(params = {}) {
    return api.get("/projects/status/ended", { params })
  },

  getProjectDetailBundle(id: number) {
    console.log(`API: Fetching detail bundle for project ${id}`);
    return api.get(`/projects/detail-bundle/${id}`);
  },

  getProject(id: number, params = {}) {
    return api.get(`/projects/id/${id}`, { params })
  },


  // NEW: Points Farming Projects
  getPointsFarmingProjects: () => api.get("/projects/points-farming"),

  // Project Activities - NEW
  getProjectActivities(projectId: number, params = {}) {
    if (DEBUG) console.log(`API: Fetching activities for project ${projectId}`)
    return api.get(`/projects/${projectId}/activities`, { params })
  },

  createProjectActivity(projectId: number, activityData: any) {
    if (DEBUG) console.log(`API: Creating activity for project ${projectId}`, activityData)
    return api.post(`/projects/${projectId}/activities`, activityData)
  },

  updateProjectActivity(activityId: number, activityData: any) {
    if (DEBUG) console.log(`API: Updating activity ${activityId}`, activityData)
    return api.put(`/project-activities/${activityId}`, activityData)
  },

  getProjectByTicker2(ticker: string, params = {}) {
    return api.get(`/projects/ticker/${ticker}`, { params })
  },

  // Create a new project (for users)
  createUserProject(projectData: any) {
    return api.post("/project/add", projectData)
  },

  // New method to get project by ticker
  async getProjectByTicker(ticker: string, params = {}) {
    if (DEBUG) console.log(`API: Fetching project by ticker: ${ticker}`)

    try {
      // First, try to get all projects and filter by ticker
      const response = await api.get("/projects", { params })

      if (response.data && response.data.data) {
        const projects = response.data.data

        // Find project by ticker (case-insensitive)
        const project = projects.find((p: any) => {
          const projectTicker = p.ticker || p.symbol || (p.token && p.token.symbol)
          return projectTicker && projectTicker.toLowerCase() === ticker.toLowerCase()
        })

        if (project) {
          // Return in the same format as the regular API response
          return {
            ...response,
            data: {
              ...response.data,
              data: project,
            },
          }
        } else {
          // If not found in the main list, try searching in different project status endpoints
          const endpoints = ["/projects/status/active", "/projects/status/upcoming", "/projects/status/ended"]

          for (const endpoint of endpoints) {
            try {
              const statusResponse = await api.get(endpoint, { params })
              if (statusResponse.data && statusResponse.data.data) {
                const statusProjects = statusResponse.data.data
                const foundProject = statusProjects.find((p: any) => {
                  const projectTicker = p.ticker || p.symbol || (p.token && p.token.symbol)
                  return projectTicker && projectTicker.toLowerCase() === ticker.toLowerCase()
                })

                if (foundProject) {
                  return {
                    ...statusResponse,
                    data: {
                      ...statusResponse.data,
                      data: foundProject,
                    },
                  }
                }
              }
            } catch (statusError) {
              console.warn(`Failed to fetch from ${endpoint}:`, statusError)
            }
          }

          // If still not found, throw a 404 error
          // Extend the Error object to include a response property
          interface ApiError extends Error {
            response?: {
              status: number
              data: { message: string }
            }
          }

          const apiError: ApiError = new Error(`Project with ticker '${ticker}' not found`)
          apiError.response = {
            status: 404,
            data: { message: `Project with ticker '${ticker}' not found` },
          }
          throw apiError
        }
      } else {
        throw new Error("No projects data received from API")
      }
    } catch (error) {
      if (DEBUG) console.error(`Error fetching project by ticker ${ticker}:`, error)
      throw error
    }
  },

  // Add this method after getVCFirm method
  getVCFirmByShortName(shortName: string, params: { noCache?: boolean;[key: string]: any } = {}) {
    const noCache = params.noCache || false
    delete params.noCache
    return api.get(`/vc-firms/short-name/${shortName}${noCache ? "?cache=false" : ""}`, { params })
  },

  // Add new method for slug (ADD THIS)
  getVCFirmBySlug(slug: string, params: { noCache?: boolean;[key: string]: any } = {}) {
    const noCache = params.noCache || false
    delete params.noCache
    console.log(`Calling VC firm slug API with: ${slug}`)
    return api.get(`/vc-firms/slug/${slug}${noCache ? "?cache=false" : ""}`, { params })
  },

  // Global search (combines all categories)
  // Unified global search endpoint
  // FORCE unified search
  async globalSearch(query = '') {
    try {
      console.log('🚀 API: Using unified search endpoint for:', query);
      const response = await this.get(`/search?q=${encodeURIComponent(query)}`);
      console.log('✅ API: Unified search response:', response);
      return response;
    } catch (error) {
      console.error('❌ API: Unified search error:', error);
      throw error;
    }
  },

  // Fallback method using individual searches
  async fallbackSearch(query = '') {
    try {
      const [projects, vcFirms, investmentFirms, investors, chains, launchpads] = await Promise.allSettled([
        this.searchProjects(query),
        this.searchVCFirm(query),
        this.searchInvestmentFirms(query),
        this.searchInvestors(query),
        this.searchChains(query),
        this.searchLaunchpads(query)
      ]);

      return {
        projects: projects.status === 'fulfilled' ? projects.value.data?.data || [] : [],
        vcFirms: vcFirms.status === 'fulfilled' ? vcFirms.value.data?.data || [] : [],
        investmentFirms: investmentFirms.status === 'fulfilled' ? investmentFirms.value.data?.data || [] : [],
        investors: investors.status === 'fulfilled' ? investors.value.data?.data || [] : [],
        chains: chains.status === 'fulfilled' ? chains.value.data?.data || [] : [],
        launchpads: launchpads.status === 'fulfilled' ? launchpads.value.data?.data || [] : []
      };
    } catch (error) {
      console.error('Fallback search error:', error);
      return {
        projects: [],
        vcFirms: [],
        investmentFirms: [],
        investors: [],
        chains: [],
        launchpads: [],
        tokens: []
      };
    }
  },

  // Projects search
  async searchProjects(query = '') {
    try {
      return await this.get(`/projects?search=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Projects search error:', error);
      return { data: { data: [] } }; // Return empty array on error
    }
  },

  // VC Firms search (already exists in your API)
  async searchVCFirm(query = '') {
    try {
      return await this.get(`/vc-firms/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('VC Firms search error:', error);
      return { data: { data: [] } };
    }
  },

  // Investment Firms search
  async searchInvestmentFirms(query = '') {
    try {
      return await this.get(`/investment-firms?search=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Investment Firms search error:', error);
      return { data: { data: [] } };
    }
  },

  // Investors search
  async searchInvestors(query = '') {
    try {
      return await this.get(`/investors?search=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Investors search error:', error);
      return { data: { data: [] } };
    }
  },

  // Chains search
  async searchChains(query = '') {
    try {
      const response = await this.get(`/chains?search=${encodeURIComponent(query)}`);
      // Return only the data array from the paginated response
      return { data: { data: response.data.data } }; // <-- ADD THIS MODIFICATION
    } catch (error) {
      console.error('Chains search error:', error);
      return { data: { data: [] } };
    }
  },

  // Launchpads search
  async searchLaunchpads(query = '') {
    try {
      return await this.get(`/launchpads?search=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Launchpads search error:', error);
      return { data: { data: [] } };
    }
  },

  // Tokens search
  async searchTokens(query = '') {
    try {
      return await this.get(`/tokens?search=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Tokens search error:', error);
      return { data: { data: [] } };
    }
  },

  // Enhanced method similar to getProjectByTicker
  // Update existing method to handle both short_name and slug
  async getVCFirmByIdentifier(identifier: string, params = {}) {
    if (DEBUG) console.log(`API: Fetching VC firm by identifier: ${identifier}`)

    try {
      const isNumeric = /^\d+$/.test(identifier)

      if (isNumeric) {
        // It's an ID
        return await this.getVCFirm(parseInt(identifier), params)
      } else {
        // Check if it looks like a slug (contains hyphens) or original short_name (contains spaces/special chars)
        if (identifier.includes('-') && !identifier.includes(' ')) {
          // It's a slug
          return await this.getVCFirmBySlug(identifier, params)
        } else {
          // It's an original short_name or encoded short_name
          const decodedName = decodeURIComponent(identifier)
          return await this.getVCFirmByShortName(decodedName, params)
        }
      }
    } catch (error) {
      if (DEBUG) console.error(`Error fetching VC firm by identifier ${identifier}:`, error)
      throw error
    }
  },

  async updatePassword(passwordData: { current_password: string; new_password: string }) {
    try {
      const response = await api.post("/update-password", passwordData)
      toast.success("Password updated successfully!")
      return response.data
    } catch (error) {
      // Handle error
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      toast.error(`Error updating password: ${errorMessage}`)
      if ((error as any)?.response) {
        if (error instanceof Error && (error as any)?.response) {
          console.error("Error updating password:", (error as any).response)
        } else {
          console.error("Error updating password:", error)
        }
      } else {
        console.error("Error updating password:", error)
      }
      throw error
    }
  },



  // Stats endpoints - Public
  getStats(params = {}) {
    console.log("API: Calling /stats endpoint")
    return api.get("/stats", { params })
  },

  getStatByKey(key: string, params = {}) {
    console.log(`API: Calling /stats/${key} endpoint`)
    return api.get(`/stats/${key}`, { params })
  },

  getProjectStats(params = {}) {
    console.log("API: Calling /stats/projects endpoint")
    return api.get("/stats/projects", { params }).catch((error) => {
      console.log("API: /stats/projects failed, trying /projects/stats")
      return api.get("/projects/stats", { params })
    })
  },

  // Chains - Public Read Operations
  getChains(params = {}) {
    return api.get("/chains", { params })
  },
  getCategories(params = {}) {
    return api.get("/project-categories", { params })
  },

  getChain(id: number, params = {}) {
    return api.get(`/chains/${id}`, { params })
  },

  getChainProjects(id: number, params = {}) {
    return api.get(`/chains/${id}/projects`, { params })
  },

  // Launchpads - Public Read Operations
  getLaunchpads(params = {}) {
    return api.get("/launchpads", { params })
  },

  getLaunchpad(id: number, params = {}) {
    return api.get(`/launchpads/${id}`, { params })
  },

  // Investment Firms - Public Read Operations
  getInvestmentFirms(params = {}) {
    return api.get("/investment-firms", { params })
  },

  getInvestmentFirm(id: number, params = {}) {
    return api.get(`/investment-firms/${id}`, { params })
  },

  getInvestmentFirmProjects(id: number, params = {}) {
    return api.get(`/investment-firms/${id}/projects`, { params })

  },

  getCoInvestorsForFirm(firmId: number, params = {}) {
    console.log(`API: Fetching co-investors for firm ${firmId}`);
    return api.get(`/investment-firms/${firmId}/coinvestors`, { params });
  },

  // This is the same as above but with a clearer name for our new feature
  getProjectsForInvestmentFirm(firmId: number) {
    return api.get(`/investment-firms/${firmId}/projects`);
  },

  getInvestmentFirmBySlug(slug: string, params = {}) {
    return api.get(`/investment-firms/slug/${slug}`, { params })
  },

  // VC Firms - Public Read Operations
  getVCFirms(params: { noCache?: boolean;[key: string]: any } = {}) {
    const noCache = params.noCache || false
    delete params.noCache
    return api.get(`/vc-firms${noCache ? "?cache=false" : ""}`, { params })
  },

  getVCFirm(id: number, params: { noCache?: boolean;[key: string]: any } = {}) {
    const noCache = params.noCache || false
    delete params.noCache
    return api.get(`/vc-firms/${id}${noCache ? "?cache=false" : ""}`, { params })
  },

  searchVCFirms(query: string, params = {}) {
    return api.get(`/vc-firms/search`, {
      params: {
        query: encodeURIComponent(query),
        ...params,
      },
    })
  },

  filterVCFirmsByType(type: string, params = {}) {
    return api.get(`/vc-firms/filter/type`, {
      params: {
        type: encodeURIComponent(type),
        ...params,
      },
    })
  },

  filterVCFirmsByTier(tier: string, params = {}) {
    return api.get(`/vc-firms/filter/tier`, {
      params: {
        tier: encodeURIComponent(tier),
        ...params,
      },
    })
  },

  getTopVCFirms(limit = 10, params = {}) {
    return api.get(`/vc-firms/top`, {
      params: {
        limit,
        ...params,
      },
    })
  },

  // ROI Indicators - Public Read Operations
  getAllRoiIndicators(params = {}) {
    return api.get("/roi-indicators", { params })
  },

  getRoiIndicator(id: number, params = {}) {
    return api.get(`/roi-indicators/${id}`, { params })
  },

  // Tokens - Public Read Operations
  getTokens(params = {}) {
    return api.get("/tokens", { params })
  },

  getToken(id: number, params = {}) {
    return api.get(`/tokens/${id}`, { params })
  },

  getTokenProjects(id: number, params = {}) {
    return api.get(`/tokens/${id}/projects`, { params })
  },

  // Contact Form
  sendContactForm(formData: { name: string; email: string; subject: string; message: string }) {
    return api.post("/contact", formData)
  },

  // FAQs
  getFaqs(params = {}) {
    return api.get("/faqs", { params })
  },

  // ===== AUTHENTICATION ENDPOINTS =====

  login(credentials: { email: string; password: string }) {
    return api.post("/login", credentials)
  },

  sendResetCode(email: string) {
    return api.post("/password/email", { email });
  },

  verifyResetCode(data: { email: string; code: string }) {
    return api.post("/password/verify", data);
  },

  resetPassword(data: { temp_token: string; password: string; password_confirmation: string }) {
    return api.post("/password/reset", data);
  },

  socialLoginRedirect(provider: string) {
    // This endpoint should return a 302 redirect, which the browser will automatically follow.
    // Axios must be configured to NOT throw an error on the 302/303 redirect status code.
    // Since we are setting window.location.href below, we don't need to return a Promise here.
    const url = `${api.defaults.baseURL}/social/${provider}/redirect`;
    return url;
  },

  // This function calls our new email checking endpoint
  checkEmail(email: string) {
    return api.post("/wallet/check-email", { email });
  },

  // This function requests the unique challenge message from the backend
  getWalletChallenge(walletAddress: string) {
    return api.post("/wallet/challenge", { wallet_address: walletAddress });
  },

  // This function sends the signature to the backend for verification
  verifyWalletSignature(walletAddress: string, signature: string) {
    return api.post("/wallet/verify", { wallet_address: walletAddress, signature: signature });
  },

  // This function sends the completed profile data for new wallet users
  completeWalletRegistration(data: { name: string; email: string; password: string, password_confirmation: string; token: string }) {
    return api.post("/wallet/complete-registration", data, {
      headers: { 'Authorization': `Bearer ${data.token}` }
    });
  },

  register(userData: any) {
    return api.post("/register", userData)
  },

  logout() {
    return api.post("/logout")
  },

  // ===== PROTECTED ENDPOINTS (AUTH REQUIRED) =====

  getUser(params = {}) {
    return api.get("/user", { params })
  },

  getProfile(params = {}) {
    return api.get("/profile", { params })
  },



  updateProfile(profileData: any) {
    return api.put("/profile", profileData)
  },

  investInProject(projectId: number, investmentData: any) {
    return api.post(`/projects/${projectId}/invest`, investmentData)
  },

  verify(payload: object) {
    return api.post(`/verify`, payload)
  },

  // ===== USER PROJECT MANAGEMENT =====

  // Get user's projects
  getMyProjects(params = {}) {
    return api.get("/my-projects", { params })
  },

  // User-specific project deletion (only for unapproved projects)
  deleteMyProject(id: number) {
    return api.delete(`/my-projects/${id}`)
  },

  getMyWallets(params = {}) {
    return api.get("/my-wallets", { params });
  },



  updateMyWallet(id: number, data: FormData) {
    data.append('_method', 'PUT'); // Fixes the PUT/POST issue for file uploads
    return api.post(`/my-wallets/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // NEW: Submits an inquiry to a developer
  submitInquiry(developerId: number, data: { subject: string; body: string }) {
    return api.post(`/developers/${developerId}/inquire`, data);
  },

  // NEW: Gets the logged-in user's sent inquiries
  getSentInquiries(params = {}) {
    return api.get('/account/inquiries/sent', { params });
  },

  // NEW: Gets the logged-in developer's received inquiries
  getReceivedInquiries(params = {}) {
    return api.get('/account/inquiries/received', { params });
  },

  markInquiriesAsRead() { // ADD THIS FUNCTION
    return api.post('/account/inquiries/mark-as-read');
  },

  // WATCHLIST FUNCTIONS
  getWatchlist() {
    return api.get('/account/watchlist');
  },
  saveToWatchlist(type: string, id: number) {
    return api.post('/watchlist/save', { type, id });
  },
  removeFromWatchlist(type: string, id: number) {
    return api.delete('/watchlist/delete', { data: { type, id } });
  },

  // ===== USER SUBMISSION ENDPOINTS =====
  createWalletSubmission(data: FormData) {
    return api.post('/my-submissions/wallets', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getUserAuditorProfile() {
    return api.get('/user/auditor-profile');
  },
  updateUserAuditorProfile(data: FormData) {
    return api.post('/my-auditor-profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  createAuditorSubmission(data: FormData) {
    return api.post('/my-submissions/auditors', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // ===== ADMIN APPROVAL ENDPOINTS =====
  getPendingWallets(params = {}) {
    return api.get('/admin/wallets/pending', { params });
  },
  approveWallet(id: number) {
    return api.put(`/admin/wallets/${id}/approve`);
  },
  getPendingAuditors(params = {}) {
    return api.get('/admin/auditors/pending', { params });
  },
  approveAuditor(id: number) {
    return api.put(`/admin/auditors/${id}/approve`);
  },





  // Admin Dashboard
  getAdminStats(params = {}) {
    return api.get("/admin/stats", { params })
  },

  // Admin Projects Management
  getAdminProjects(params = {}) {
    return api.get("/admin/projects", { params })
  },

  getAdminProject(id: number, params = {}) {
    return api.get(`/admin/projects/${id}`, { params })
  },

  // New method to get admin project by ticker
  async getAdminProjectByTicker(ticker: string, params = {}) {
    if (DEBUG) console.log(`API: Fetching admin project by ticker: ${ticker}`)

    try {
      // Get all admin projects and filter by ticker
      const response = await api.get("/admin/projects", { params })

      if (response.data && response.data.data) {
        const projects = response.data.data

        // Find project by ticker (case-insensitive)
        const project = projects.find((p: any) => {
          const projectTicker = p.ticker || p.symbol || (p.token && p.token.symbol)
          return projectTicker && projectTicker.toLowerCase() === ticker.toLowerCase()
        })

        if (project) {
          // Return in the same format as the regular API response
          return {
            ...response,
            data: {
              ...response.data,
              data: project,
            },
          }
        } else {
          // If not found, throw a 404 error
          const error = new Error(`Admin project with ticker '${ticker}' not found`)
          const customError = error as { response?: { status: number; data: { message: string } } }
          customError.response = {
            status: 404,
            data: { message: `Admin project with ticker '${ticker}' not found` },
          }
          throw error
        }
      } else {
        throw new Error("No admin projects data received from API")
      }
    } catch (error) {
      if (DEBUG) console.error(`Error fetching admin project by ticker ${ticker}:`, error)
      throw error
    }
  },

  createProject(projectData: any) {
    return api.post("/admin/projects", projectData)
  },

  // COMPLETELY REVISED: Enhanced updateProject method with proper field mapping
  updateProject(id: number, projectData: any) {
    console.log(`API: Updating project ${id} with data:`, projectData)

    // Create a comprehensive payload with all possible fields
    // Using both camelCase and snake_case for maximum compatibility
    const payload: Record<string, any> = {
      // Basic Info fields
      name: projectData.name,
      ticker: projectData.ticker,
      category: projectData.category,
      status: projectData.status,
      badge: projectData.badge,
      chain: projectData.chain,
      shortDescription: projectData.shortDescription,
      short_description: projectData.shortDescription,
      ranking: projectData.ranking,
      sponsored: projectData.sponsored,



      // Details fields
      saleType: projectData.saleType,
      sale_type: projectData.saleType,
      saleDate: projectData.saleDate,
      sale_date: projectData.saleDate,
      end_date: projectData.endDate,
      amount: projectData.amount,
      preValuation: projectData.preValuation,
      pre_valuation: projectData.preValuation,
      tokenPrice: projectData.tokenPrice,
      token_price: projectData.tokenPrice,
      tokenSupply: projectData.tokenSupply,
      token_supply: projectData.tokenSupply,
      description: projectData.description,

      // Media fields
      logoUrl: projectData.logoUrl,
      logo_url: projectData.logoUrl,
      logo: projectData.logoUrl, // For backward compatibility
      bannerUrl: projectData.banner_url || projectData.bannerUrl,
      banner_url: projectData.banner_url || projectData.bannerUrl,
      banner: projectData.banner_url || projectData.bannerUrl, // For backward compatibility

      // Links fields
      website: projectData.website,
      twitter: projectData.twitter,
      telegram: projectData.telegram,
      discord: projectData.discord,
      github: projectData.github,
      whitepaper: projectData.whitepaper,

      // Advanced fields
      rating: projectData.rating,
      featured: projectData.featured,
      contractAddress: projectData.contractAddress,
      contract_address: projectData.contractAddress,
      launchpad: projectData.launchpad,
      tags: projectData.tags,

      // Additional fields that might be in the database
      has_points_farming: projectData.hasPointsFarming || projectData.has_points_farming || false,
      is_new_farming: projectData.isNewFarming || projectData.is_new_farming || false,
      has_tier1_vc: projectData.hasTier1VC || projectData.has_tier1_vc || false,
      tvl: projectData.tvl || 0,
      tvl_formatted: projectData.tvlFormatted || projectData.tvl_formatted || "",
      tvl_chart: projectData.tvlChart || projectData.tvl_chart || "",
      farming_start_date: projectData.farmingStartDate || projectData.farming_start_date || null,
      tge_date: projectData.tgeDate || projectData.tge_date || null,
      investment_amount: projectData.investmentAmount || projectData.investment_amount || 0,
      investment_formatted: projectData.investmentFormatted || projectData.investment_formatted || "",
      listings: projectData.listings || [],
      approved:
        projectData.approved === undefined || projectData.approved === null
          ? 0
          : Number(projectData.approved) === 1
            ? 1
            : 0,


      investment_firms: projectData.investment_firms || []

    }
    console.log(`686API: Updating project ${id} with data:`, payload)

    // Remove undefined values to avoid overwriting with null
    Object.keys(payload).forEach((key) => {
      if ((payload as Record<string, any>)[key] === undefined) {
        delete payload[key]
      }
    })

    if (DEBUG) console.log("Final payload for update:", payload)

    return api.put(`/admin/projects/${id}`, payload)
  },

  deleteProject(id: number) {
    return api.delete(`/admin/projects/${id}`)
  },

  // Admin Project Activities Management
  getAdminProjectActivities(projectId: number, params = {}) {
    if (DEBUG) console.log(`API: Fetching activities for project ${projectId}`)
    return api.get(`/admin/projects/${projectId}/activities`, { params })
  },

  createAdminProjectActivity(projectId: number, activityData: any) {
    if (DEBUG) console.log(`API: Creating activity for project ${projectId}`, activityData)
    return api.post(`/admin/projects/${projectId}/activities`, activityData)
  },

  updateAdminProjectActivity(activityId: number, activityData: any) {
    if (DEBUG) console.log(`API: Updating activity ${activityId}`, activityData)
    // Note: We use the simpler '/admin/activities/{id}' route for updates
    return api.put(`/admin/activities/${activityId}`, activityData)
  },

  deleteAdminProjectActivity(activityId: number) {
    if (DEBUG) console.log(`API: Deleting activity ${activityId}`)
    // Note: We use the simpler '/admin/activities/{id}' route for deletions
    return api.delete(`/admin/activities/${activityId}`)
  },

  // Admin Investment Firms Management
  getAdminInvestmentFirms(params = {}) {
    return api.get("/admin/investment-firms", { params })
  },

  // ADD THIS NEW FUNCTION
  removeProjectFromFirm(firmId: number, projectId: number) {
    return api.delete(`/admin/investment-firms/${firmId}/projects/${projectId}`);
  },

  getAdminInvestmentFirm(id: number, params = {}) {
    return api.get(`/admin/investment-firms/${id}`, { params })
  },

  createInvestmentFirm(firmData: any) {
    return api.post("/admin/investment-firms", firmData)
  },

  updateInvestmentFirm(id: number, firmData: any) {
    return api.put(`/admin/investment-firms/${id}`, firmData)
  },

  deleteInvestmentFirm(id: number) {
    return api.delete(`/admin/investment-firms/${id}`)
  },

  // Admin Token Management
  createToken(tokenData: any) {
    return api.post("/admin/tokens", tokenData)
  },

  updateToken(id: number, tokenData: any) {
    return api.put(`/admin/tokens/${id}`, tokenData)
  },

  deleteToken(id: number) {
    return api.delete(`/admin/tokens/${id}`)
  },

  // Admin Investor Management
  createInvestor(investorData: any) {
    return api.post("/admin/investors", investorData)
  },

  updateInvestor(id: number, investorData: any) {
    return api.put(`/admin/investors/${id}`, investorData)
  },

  deleteInvestor(id: number) {
    return api.delete(`/admin/investors/${id}`)
  },

  // Admin Chain Management
  getAdminChains(params = {}) {
    return api.get('/admin/chains', { params });
  },

  
  createAdminChain(data: FormData) {
    return api.post('/admin/chains', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateAdminChain(id: number, data: FormData) {
    data.append('_method', 'PUT'); // Spoof PUT method for FormData
    return api.post(`/admin/chains/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteAdminChain(id: number) {
    return api.delete(`/admin/chains/${id}`);
  },

  // Admin Launchpad Management
  createLaunchpad(launchpadData: any) {
    return api.post("/admin/launchpads", launchpadData)
  },

  updateLaunchpad(id: number, launchpadData: any) {
    return api.put(`/admin/launchpads/${id}`, launchpadData)
  },

  deleteLaunchpad(id: number) {
    return api.delete(`/admin/launchpads/${id}`)
  },

  // Admin ROI Indicators Management
  createRoiIndicator(indicatorData: any) {
    return api.post("/admin/roi-indicators", indicatorData)
  },

  updateRoiIndicator(id: number, indicatorData: any) {
    return api.put(`/admin/roi-indicators/${id}`, indicatorData)
  },

  deleteRoiIndicator(id: number) {
    return api.delete(`/admin/roi-indicators/${id}`)
  },

  // Admin Stats Management
  createStat(statData: any) {
    return api.post("/admin/stats", statData)
  },

  updateStat(key: string, statData: any) {
    return api.put(`/admin/stats/${key}`, statData)
  },

  deleteStat(key: string) {
    return api.delete(`/admin/stats/${key}`)
  },

  // ===== ADMIN VC FIRMS MANAGEMENT - MISSING METHODS ADDED =====

  // Admin VC Firms - Read Operations (THESE WERE MISSING!)
  getAdminVCFirms(params = {}) {
    if (DEBUG) console.log("API: Fetching admin VC firms")
    return api.get("/admin/vc-firms", { params })
  },

  getAdminVCFirm(id: number, params = {}) {
    if (DEBUG) console.log(`API: Fetching admin VC firm ${id}`)
    return api.get(`/admin/vc-firms/${id}`, { params })
  },

  // Admin VC Firms - Write Operations (THESE WERE ALREADY PRESENT)
  createVCFirm(vcFirmData: any) {
    if (DEBUG) console.log("API: Creating VC firm", vcFirmData)
    return api.post("/admin/vc-firms", vcFirmData)
  },

  updateVCFirm(id: number, vcFirmData: any) {
    if (DEBUG) console.log(`API: Updating VC firm ${id}`, vcFirmData)
    return api.put(`/admin/vc-firms/${id}`, vcFirmData)
  },

  deleteVCFirm(id: number) {
    if (DEBUG) console.log(`API: Deleting VC firm ${id}`)
    return api.delete(`/admin/vc-firms/${id}`)
  },

  // ===== ADMIN USER MANAGEMENT - MISSING METHODS ADDED =====

  // Admin Users - Read Operations
  getAdminUsers(params = {}) {
    if (DEBUG) console.log("API: Fetching admin users")
    console.log("API: Fetching admin users with params:", api)

    return api.get("/admin/users", { params })
  },

  getAdminUser(id: number, params = {}) {
    if (DEBUG) console.log(`API: Fetching admin user ${id}`)
    return api.get(`/admin/users/${id}`, { params })
  },

  // Admin Users - Write Operations
  createUser(userData: any) {
    if (DEBUG) console.log("API: Creating user", userData)
    return api.post("/admin/users", userData)
  },

  updateUser(id: number, userData: any) {
    if (DEBUG) console.log(`API: Updating user ${id}`, userData)
    return api.put(`/admin/users/${id}`, userData)
  },

  deleteUser(id: number) {
    if (DEBUG) console.log(`API: Deleting user ${id}`)
    return api.delete(`/admin/users/${id}`)
  },

  // Admin Users - Bulk Operations
  bulkDeleteUsers(userIds: number[]) {
    if (DEBUG) console.log("API: Bulk deleting users", userIds)
    return api.post("/admin/users/bulk-delete", { ids: userIds })
  },

  bulkUpdateUserStatus(userIds: number[], status: string) {
    if (DEBUG) console.log(`API: Bulk updating user status to ${status}`, userIds)
    return api.post("/admin/users/bulk-status", { ids: userIds, status })
  },

  bulkUpdateUserAdmin(userIds: number[], isAdmin: boolean) {
    if (DEBUG) console.log(`API: Bulk updating user admin status to ${isAdmin}`, userIds)
    return api.post("/admin/users/bulk-update-admin", { ids: userIds, is_admin: isAdmin })
  },

  // Cache management
  clearCache(cacheKey: string) {
    return api.post("/clear-cache", { key: cacheKey })
  },

  clearVCFirmsCache() {
    return api.post("/vc-firms/clear-cache")
  },

  // Health check
  checkApiHealth() {
    return api.get("/health-check")
  },

  // Add this method to icoService
  getProjectsForInvestmentFirms(firmId: number) {
    // This now correctly calls the PUBLIC API endpoint.
    return api.get(`/investment-firms/${firmId}/projects`);
  },

  getTrendingProjects() {
    return api.get("/projects/trending-today")
  },
  getSimilarProjects(id: number) {
    return api.get(`/projects/${id}/similar`)
  },

  // Add these methods for file uploads
  uploadBannerImage(formData: FormData) {
    return apiServiceInstance.uploadBannerImage(formData)
  },

  uploadLogoImage(formData: FormData) {
    return apiServiceInstance.uploadLogoImage(formData)
  },

  // Check ranking availability
  checkProjectRanking(ranking: number, excludeId?: number) {
    const params: { ranking: number; exclude_id?: number } = { ranking };
    if (excludeId) {
      params.exclude_id = excludeId;
    }

    return api.get("/admin/projects/check-ranking", { params });
  },

  // ===== ADMIN SPONSORSHIP MANAGEMENT (NEW) =====

  getSponsorships() {
    if (DEBUG) console.log(`API: Fetching all sponsorships`);
    return api.get(`/admin/sponsorships`);
  },

  createSponsorship(sponsorshipData: any) {
    if (DEBUG) console.log(`API: Creating sponsorship`, sponsorshipData);
    return api.post(`/admin/sponsorships`, sponsorshipData);
  },

  updateSponsorship(id: number, sponsorshipData: any) {
    if (DEBUG) console.log(`API: Updating sponsorship ${id}`, sponsorshipData);
    return api.put(`/admin/sponsorships/${id}`, sponsorshipData);
  },

  deleteSponsorship(sponsorshipId: number) {
    if (DEBUG) console.log(`API: Deleting sponsorship ${sponsorshipId}`);
    return api.delete(`/admin/sponsorships/${sponsorshipId}`);
  },

  // ===== AD MANAGEMENT =====
  getActiveAds() {
    return api.get('/ads');
  },
  getAds(params = {}) {
    return api.get('/admin/ads', { params });
  },
  createAd(adData: FormData) {
    return api.post('/admin/ads', adData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateAd(id: number, adData: FormData) {
    return api.post(`/admin/ads/${id}`, adData, { // Use POST for FormData with _method
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteAd(id: number) {
    return api.delete(`/admin/ads/${id}`);
  },

  // ===== ADMIN CEX/DEX MANAGEMENT =====
  getAdminExchanges(params = {}) {
    return api.get('/admin/exchanges', { params });
  },
  createAdminExchange(data: FormData) {
    return api.post('/admin/exchanges', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateAdminExchange(id: number, data: FormData) {
    data.append('_method', 'PUT');
    return api.post(`/admin/exchanges/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteAdminExchange(id: number) {
    return api.delete(`/admin/exchanges/${id}`);
  },
  getAdminMarkets(params = {}) {
    return api.get('/admin/markets', { params });
  },


  getAdminChain(id: number) {
    return api.get(`/admin/chains/${id}`);
  },
  createAdminMarket(data: FormData) {
    return api.post('/admin/markets', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateAdminMarket(id: number, data: FormData) {
    data.append('_method', 'PUT');
    return api.post(`/admin/markets/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteAdminMarket(id: number) {
    return api.delete(`/admin/markets/${id}`);
  },

  // ===== PUBLIC CEX/DEX ENDPOINTS =====
  getExchanges(params = {}) {
    return api.get('/exchanges', { params });
  },
  getExchange(slug: string, params = {}) {
    return api.get(`/exchanges/${slug}`, { params });
  },
  getCoinBySymbol(symbol: string) {
    return api.get(`/coins/${symbol}`);
  },
  getExchangesForCoin(base_currency: string) {
    return api.get(`/coins/${base_currency}/exchanges`);
  },

  // ADD THIS NEW FUNCTION
  getWallets(params = {}) {
    return api.get('/wallets', { params });
  },

  getWalletBySlug(slug: string) {
    return api.get(`/wallets/${slug}`);
  },

  getAuditors(params = {}) {
    return api.get('/auditors', { params });
  },
  getAuditorBySlug(slug: string) {
    return api.get(`/auditors/${slug}`);
  },

  //wallets
  // Add these functions inside your icoService object
  getAdminWallets(params = {}) {
    return api.get('/admin/wallets', { params });
  },

  getAdminWallet(id: number) {
    return api.get(`/admin/wallets/${id}`);
  },

  createAdminWallet(data: FormData) {
    return api.post('/admin/wallets', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updateAdminWallet(id: number, data: FormData) {
    data.append('_method', 'PUT'); // Fixes the PUT/POST issue for file uploads
    return api.post(`/admin/wallets/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteAdminWallet(id: number) {
    return api.delete(`/admin/wallets/${id}`);
  },

  // ADD THESE NEW FUNCTIONS FOR AUDITORS
  getAdminAuditors(params = {}) {
    return api.get('/admin/auditors', { params });
  },
  createAdminAuditor(data: FormData) {
    return api.post('/admin/auditors', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateAdminAuditor(id: number, data: FormData) {
    // We MUST use .post() for file uploads.
    // data.append('_method', 'PUT') tells Laravel to treat this POST request as a PUT request.
    data.append('_method', 'PUT');
    return api.post(`/admin/auditors/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteAdminAuditor(id: number) {
    return api.delete(`/admin/auditors/${id}`);
  },

  // Add these methods to the icoService object
  createDeveloperSubmission(data: FormData) {
    return api.post('/my-submissions/developers', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Add method to get developer by user ID
  getUserDeveloperProfile() {
    return api.get('/user/developer-profile');
  },

  updateUserDeveloperProfile(data: FormData) {
    // We use POST because FormData doesn't work well with PUT/PATCH
    return api.post('/user/developer-profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getDeveloperSkills() {
    return api.get('/developer-skills');
  },

  getDevelopers(params = {}) {
    return api.get('/developers', { params });
  },

  getDeveloperBySlug(slug: string) {
    return api.get(`/developers/${slug}`);
  },

  getLoginAttempts(params = {}) {
    return api.get('/login-attempts', { params });
  },

  // Add these new 2FA methods
  generate2FASecret() {
    return api.post('/2fa/generate-secret');
  },
  enable2FA(code: string) {
    return api.post('/2fa/enable', { code });
  },
  disable2FA(code: string) {
    return api.post('/2fa/disable', { code });
  },
  verify2FACode(tempToken: string, code: string) {
    // We now call a standard endpoint, providing the temporary token as the Bearer token.
    return api.post('/login/2fa/verify', { code }, {
      headers: {
        'Authorization': `Bearer ${tempToken}`
      }
    });
  },

  // Admin methods
  getAdminDevelopers(params = {}) {
    return api.get('/admin/developers', { params });
  },

  createAdminDeveloper(data: FormData) {
    return api.post('/admin/developers', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updateAdminDeveloper(id: number, data: FormData) {
    data.append('_method', 'PUT');
    return api.post(`/admin/developers/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteAdminDeveloper(id: number) {
    return api.delete(`/admin/developers/${id}`);
  },

  getPendingDevelopers() {
    return api.get('/admin/developers/pending');
  },

  approveDeveloper(id: number) {
    return api.put(`/admin/developers/${id}/approve`);
  },

  verifyDeveloper(id: number) {
    return api.put(`/admin/developers/${id}/verify`);
  },

  // ADMIN WATCHLIST MANAGEMENT
  getAdminWatchlists(params = {}) {
    return api.get('/admin/watchlists', { params });
  },
  getAdminUserWatchlist(userId: number) {
    return api.get(`/admin/watchlists/${userId}`);
  },
  deleteAdminWatchlistItem(watchlistId: number) {
    return api.delete(`/admin/watchlists/${watchlistId}`);
  },

  // ADMIN LOGIN ATTEMPTS
  getAdminLoginAttempts(params = {}) {
    return api.get('/admin/login-attempts', { params });
  },

  // ADMIN INQUIRY MANAGEMENT
  getAdminInquiries(params = {}) {
    return api.get('/admin/inquiries', { params });
  },
  deleteAdminInquiry(inquiryId: number) {
    return api.delete(`/admin/inquiries/${inquiryId}`);
  },

  // uploadDeveloperProfilePicture(id: number, formData: FormData) {
  //   return api.post(`/admin/developers/${id}/upload-profile-picture`, formData, {
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   });
  // }

  updateAvatar(data: FormData) {
    return api.post('/profile/avatar', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },


}

export default icoService
