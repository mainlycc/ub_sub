const API_BASE_URL = process.env.NEXT_PUBLIC_IDEFEND_API_URL || "https://test.v2.idefend.eu/api";
const SELLER_NODE_CODE = process.env.NEXT_PUBLIC_IDEFEND_SELLER_NODE || "PL_TEST_GAP_25";
const API_CREDENTIALS = {
  username: process.env.NEXT_PUBLIC_IDEFEND_USERNAME || "GAP_2025_PL",
  password: process.env.NEXT_PUBLIC_IDEFEND_PASSWORD || "LEaBY4TXgWa4QJX",
};

type ApiError = {
  message: string;
  code: string;
};

export interface PolicyFormData {
  productCode: string;
  vehicleData: {
    makeId: string;
    modelId: string;
    year: number;
    registrationNumber: string;
  };
  clientData: {
    firstName: string;
    lastName: string;
    pesel: string;
    email: string;
    phoneNumber: string;
    address: {
      street: string;
      houseNumber: string;
      apartmentNumber?: string;
      postalCode: string;
      city: string;
    };
  };
  startDate: string;
  duration: number;
  paymentType: string;
  installments: number;
}

export class IDefendApi {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, method: string = "GET", data?: any) {
    if (!this.token && endpoint !== "/jwt-token") {
      await this.authorize();
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["X-NODE-JWT-AUTH-TOKEN"] = this.token;
    }

    console.log(`Wysyłanie żądania ${method} do ${this.baseUrl}${endpoint}`, {
      headers,
      body: data,
    });

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `HTTP error! status: ${response.status}`,
          details: `Endpoint: ${endpoint}, Method: ${method}`
        }));
        throw new Error(errorData.message || `Błąd HTTP! Status: ${response.status}`);
      }

      if (method === "DELETE" || response.status === 204) {
        return null;
      }

      const responseData = await response.json();
      console.log(`Odpowiedź z ${endpoint}:`, responseData);
      return responseData;
    } catch (error) {
      console.error("Błąd zapytania API:", error);
      throw error;
    }
  }

  async authorize() {
    try {
      console.log("Próba autoryzacji z:", `${this.baseUrl}/jwt-token`);
      
      const response = await fetch(`${this.baseUrl}/jwt-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: API_CREDENTIALS.username,
          password: API_CREDENTIALS.password,
        }),
      });

      console.log("Status odpowiedzi autoryzacji:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Błąd autoryzacji" }));
        console.error("Błąd odpowiedzi autoryzacji:", errorData);
        throw new Error(errorData.message || "Błąd autoryzacji");
      }

      const data = await response.json();
      console.log("Otrzymano odpowiedź autoryzacji:", { ...data, token: data.token ? "..." + data.token.slice(-10) : null });
      
      this.token = data.token;

      if (!this.token) {
        throw new Error("Nie otrzymano tokenu autoryzacyjnego");
      }
    } catch (error) {
      console.error("Błąd autoryzacji:", error);
      throw new Error("Nie udało się zalogować do systemu");
    }
  }

  async setToken(token: string) {
    this.token = token;
  }

  async calculateOffer(data: PolicyFormData) {
    return this.request("/calculate-offer", "POST", data);
  }

  async submitPolicy(data: PolicyFormData) {
    const response = await this.request("/policies", "POST", {
      ...data,
      signatureTypeCode: "AUTHORIZED_BY_SMS",
    });
    return { policyId: response.id };
  }

  async getVehicleMakes() {
    return this.request("/vehicle-makes");
  }

  async getVehicleModels(makeId: string) {
    return this.request(`/vehicle-makes/${makeId}/models`);
  }

  async getPortfolios() {
    try {
      if (!this.token) {
        await this.authorize();
      }
      
      console.log("Token autoryzacyjny:", this.token);
      console.log("Pobieranie produktów z:", `${this.baseUrl}/products`);
      
      return this.request("/products");
    } catch (error) {
      console.error("Błąd podczas pobierania produktów:", error);
      throw error;
    }
  }

  async verifySmsCode(policyId: string, code: string): Promise<void> {
    await this.request(`/policies/${policyId}/verify-sms`, "POST", { code });
  }

  async resendSmsCode(policyId: string): Promise<void> {
    await this.request(`/policies/${policyId}/resend-sms`, "POST");
  }

  async getPolicyDetails(policyId: string) {
    return this.request(`/policies/${policyId}`);
  }

  async getPolicyDocuments(policyId: string) {
    return this.request(`/policies/${policyId}/documents`);
  }
}

export const idefendApi = new IDefendApi(API_BASE_URL); 