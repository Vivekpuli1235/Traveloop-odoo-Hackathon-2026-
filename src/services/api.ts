const API_URL = "/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async login(credentials: any) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async register(data: any) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Trips
  async getTrips() {
    const res = await fetch(`${API_URL}/trips`, { headers: getHeaders() });
    return res.json();
  },

  async getTrip(id: string | number) {
    const res = await fetch(`${API_URL}/trips/${id}`, { headers: getHeaders() });
    return res.json();
  },

  async createTrip(data: any) {
    const res = await fetch(`${API_URL}/trips`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteTrip(id: string | number) {
    const res = await fetch(`${API_URL}/trips/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  // Stops & Activities
  async addStop(tripId: string | number, data: any) {
    const res = await fetch(`${API_URL}/trips/${tripId}/stops`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async addActivity(stopId: string | number, data: any) {
    const res = await fetch(`${API_URL}/stops/${stopId}/activities`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Public
  async getPublicTrip(id: string | number) {
    const res = await fetch(`${API_URL}/public/trips/${id}`);
    return res.json();
  },

  // Checklist
  async getChecklist(tripId: string | number) {
    const res = await fetch(`${API_URL}/trips/${tripId}/checklist`, { headers: getHeaders() });
    return res.json();
  },

  async addChecklistItem(tripId: string | number, data: any) {
    const res = await fetch(`${API_URL}/trips/${tripId}/checklist`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async toggleChecklistItem(id: string | number, is_packed: boolean) {
    const res = await fetch(`${API_URL}/checklist/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ is_packed }),
    });
    return res.json();
  },

  async deleteChecklistItem(id: string | number) {
    const res = await fetch(`${API_URL}/checklist/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  // Notes
  async getNotes(tripId: string | number) {
    const res = await fetch(`${API_URL}/trips/${tripId}/notes`, { headers: getHeaders() });
    return res.json();
  },

  async addNote(tripId: string | number, data: any) {
    const res = await fetch(`${API_URL}/trips/${tripId}/notes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteNote(id: string | number) {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },
  
  // Community Ratings
  async getTopRatings() {
    const res = await fetch(`${API_URL}/ratings/top`);
    return res.json();
  },

  async getCommunityRatings() {
    const res = await fetch(`${API_URL}/ratings/community`);
    return res.json();
  },

  async addRating(data: any) {
    const res = await fetch(`${API_URL}/ratings`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Profile
  async getProfile() {
    const res = await fetch(`${API_URL}/user/profile`, { headers: getHeaders() });
    return res.json();
  },

  async updateProfile(data: any) {
    const res = await fetch(`${API_URL}/user/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  }
};
