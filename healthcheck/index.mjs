import axios from "axios";

const fqdn = process.env.WANDERERS_INFO_BACKEND_URL;
const res = await axios.get(`${fqdn}/v1/healthcheck`);

export async function handler() {
  console.log(res.data);
  return res.data;
}
