"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { toast } from "sonner";
import { roleColors } from "@/lib/roleColors";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NewHostFormProps = {
  onSuccess?: () => void;
};

export default function NewHostForm({ onSuccess }: NewHostFormProps) {
  const addHost = useDashboardStore((state) => state.addHost);
  const user = useDashboardStore((state) => state.user);
  const token = useDashboardStore((state) => state.token);
  const sites = useDashboardStore((state) => state.sites);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("inactive");
  const [siteId, setSiteId] = useState("");
  const [unit, setUnit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    // Basic validation
    if (!email || !phoneNumber || !name || !idNumber || !unit || !siteId) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/hosts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phoneNumber: Number(phoneNumber),
            idNumber: Number(idNumber),
            email,
            site: siteId,
            unit,
          }),
        },
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to create host.");
        toast.error(data.message || "Failed to create host.");
        return;
      }

      const responseData = await response.json();
      
      // Find the full site object from the store
      const fullSite = sites.find((s) => s.id === siteId);
      
      // Map _id to id for consistency
      const hostWithId = {
        ...responseData.host,
        id: responseData.host._id,
        site: fullSite || responseData.host.site,
      };
      
      addHost(hostWithId);
      toast.success("Host created successfully!");
      onSuccess && onSuccess();
      // Optionally reset form or close dialog here

      setEmail("");
      setName("");
      setPhoneNumber("");
      setIdNumber("");
      setSiteId("");
      setUnit("");
      setStatus("inactive");
      setError("");
      // Optionally, show a success message or refresh the list
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-4/5 m-auto max-md:my-10 h-fit">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Host Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Host Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="Phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              type="number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
              placeholder="ID Number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Select
              value={siteId}
              onValueChange={(value: string) => setSiteId(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name} - {site.location}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
              placeholder="Host Unit"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: "active" | "inactive") => setStatus(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-2/5 mx-auto">
            <Button
              type="submit"
              disabled={isLoading}
              className={`${roleColors[user?.role as keyof typeof roleColors]} w-full cursor-pointer`}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
