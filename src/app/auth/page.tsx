import { Metadata } from "next";
import AuthClient from "./AuthClient";

export const metadata: Metadata = {
  title: "Neural Access",
  description: "Authenticate to access your advanced AI ads optimization dashboard.",
};

export default function AuthPage() {
  return <AuthClient />;
}
