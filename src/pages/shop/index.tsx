import { useState } from "react";
import { BusinessInfoCard, type BusinessInfo } from "./components/BusinessInfoCard";
import { SalesTeamCard, type SalesPerson } from "./components/SalesTeamCard";
import { toast } from "sonner";

export const SetupShopPage = () => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: "Lota Provisions",
    businessType: "Add your business type",
    phoneNumber: "08012345689",
    email: "",
    address: "",
  });

  const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([]);

  // Handle business info update
  const handleUpdateBusinessInfo = async (info: BusinessInfo) => {
    // TODO: Replace with your API call
    // await updateBusinessInfo(info).unwrap();
    setBusinessInfo(info);
  };

  // Handle add sales person
  const handleAddPerson = async (person: Omit<SalesPerson, "id">) => {
    // TODO: Replace with your API call
    // const newPerson = await addSalesPerson(person).unwrap();
    const newPerson = { ...person, id: Date.now().toString() };
    setSalesPersons([...salesPersons, newPerson]);
  };

  // Handle update sales person
  const handleUpdatePerson = async (
    id: string,
    updates: Partial<SalesPerson>
  ) => {
    // TODO: Replace with your API call
    // await updateSalesPerson(id, updates).unwrap();
    setSalesPersons(
      salesPersons.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  // Handle delete sales person
  const handleDeletePerson = async (id: string) => {
    if (!confirm("Are you sure you want to remove this sales person?")) return;
    
    // TODO: Replace with your API call
    // await deleteSalesPerson(id).unwrap();
    setSalesPersons(salesPersons.filter((p) => p.id !== id));
    toast.success("Sales person removed successfully!");
  };

  return (
    <section className="py-6">
      {/* Header */}
      <article className="mb-6">
        <h1 className="h3 text-secondary mb-2">Setup Your Shop</h1>
        <p className="text-black">
          Easily manage your sales team and access permissions
        </p>
      </article>

      {/* Business Info Card */}
      <BusinessInfoCard
        businessInfo={businessInfo}
        onUpdate={handleUpdateBusinessInfo}
      />

      {/* Sales Team Card */}
      <SalesTeamCard
        salesPersons={salesPersons}
        maxPersons={5}
        onAddPerson={handleAddPerson}
        onUpdatePerson={handleUpdatePerson}
        onDeletePerson={handleDeletePerson}
      />
    </section>
  );
};