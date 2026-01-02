import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface Party {
  id: string;
  name: string;
  gstin?: string;
  phone?: string;
  address?: string;
  type: "customer" | "supplier";
  balance: number;
}

interface PartySelectorProps {
  value: string;
  onChange: (value: string) => void;
  partyType?: "customer" | "supplier" | "all";
  label?: string;
}

const sampleParties: Party[] = [
  { id: "1", name: "Rahul Electronics", gstin: "27AABCU9603R1ZM", phone: "9876543210", address: "Mumbai, Maharashtra", type: "customer", balance: 15000 },
  { id: "2", name: "Sharma Traders", gstin: "27AABCU9603R1ZN", phone: "9876543211", address: "Delhi", type: "customer", balance: 7800 },
  { id: "3", name: "Quick Mart", gstin: "27AABCU9603R1ZO", phone: "9876543212", address: "Pune, Maharashtra", type: "customer", balance: 8400 },
  { id: "4", name: "Global Systems", gstin: "27AABCU9603R1ZP", phone: "9876543213", address: "Bangalore, Karnataka", type: "customer", balance: 0 },
  { id: "5", name: "Tech Solutions", gstin: "27AABCU9603R1ZQ", phone: "9876543214", address: "Hyderabad, Telangana", type: "customer", balance: -5000 },
  { id: "6", name: "ABC Suppliers", gstin: "27AABCU9603R1ZR", phone: "9876543215", address: "Chennai, Tamil Nadu", type: "supplier", balance: -25000 },
  { id: "7", name: "XYZ Distributors", gstin: "27AABCU9603R1ZS", phone: "9876543216", address: "Kolkata, West Bengal", type: "supplier", balance: -12000 },
];

export function PartySelector({ value, onChange, partyType = "all", label = "Select Party" }: PartySelectorProps) {
  const filteredParties = partyType === "all" 
    ? sampleParties 
    : sampleParties.filter(p => p.type === partyType);

  const selectedParty = sampleParties.find(p => p.id === value);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Search or select party..." />
        </SelectTrigger>
        <SelectContent>
          {filteredParties.map((party) => (
            <SelectItem key={party.id} value={party.id}>
              <div className="flex flex-col">
                <span className="font-medium">{party.name}</span>
                <span className="text-xs text-muted-foreground">{party.phone}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedParty && (
        <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg space-y-1">
          <p><span className="font-medium">GSTIN:</span> {selectedParty.gstin || "N/A"}</p>
          <p><span className="font-medium">Phone:</span> {selectedParty.phone || "N/A"}</p>
          <p><span className="font-medium">Address:</span> {selectedParty.address || "N/A"}</p>
          <p>
            <span className="font-medium">Balance:</span>{" "}
            <span className={selectedParty.balance >= 0 ? "text-success" : "text-destructive"}>
              ₹{Math.abs(selectedParty.balance).toLocaleString("en-IN")} {selectedParty.balance >= 0 ? "receivable" : "payable"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export { sampleParties };
