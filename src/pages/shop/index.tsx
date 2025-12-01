import { useEffect, useState } from "react";
import { BusinessInfoCard, type BusinessInfo } from "./components/BusinessInfoCard";
import { SalesTeamCard, type SalesPerson, type SalesPersonFormValues } from "./components/SalesTeamCard";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import { handleApiError } from "../../lib/errorHandler";
import { formatNigerianPhoneNumber } from "../../components/common/validation";
import { EnumBusinessType } from "../../types/general";
import { 
  useCreateStaffMutation, 
  useUpdateStaffMutation,
  useGetStaffByShopQuery,
  useDeleteStaffMutation 
} from "../../services/staff.service";
import { 
  useUpdateProfileMutation,
  useGetShopProfileQuery 
} from "../../services/shop.service";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";

export const SetupShopPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

   // API Hooks
   const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
   const [createStaff, { isLoading: isCreatingStaff }] = useCreateStaffMutation();
   const [updateStaff, { isLoading: isUpdatingStaff }] = useUpdateStaffMutation();
   const [deleteStaff, { isLoading: isDeletingStaff }] = useDeleteStaffMutation();
   
   // Fetch shop profile
   const { 
     data: shopProfileData, 
  isLoading: isLoadingShop,
  error: shopError,        // ✅ ADD
  refetch: refetchShop     // ✅ ADD
    } = useGetShopProfileQuery(
     user?.shopId || "", 
     { skip: !user?.shopId }
   );
   
   // Fetch staff list
   const { 
    data: staffData, 
  isLoading: isLoadingStaff,
  error: staffError,       // ✅ ADD
  refetch: refetchStaff    // ✅ ADD
    } = useGetStaffByShopQuery(
     user?.shopId || "", 
     { skip: !user?.shopId }
   );



   const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
     businessName: "",
     businessType: EnumBusinessType.RETAIL,
     phoneNumber: "",
     email: "",
     address: "",
   });
 
   const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([]);
   
    // Update business info when shop profile is loaded
  useEffect(() => {
    if (shopProfileData?.data) {
      const shop = shopProfileData.data;
      setBusinessInfo({
        businessName: shop.shopName || "",
        businessType: shop.businessType || EnumBusinessType.RETAIL,
        phoneNumber: shop.phoneNumber || "",
        email: "shop@ventree.com",
        address: shop.address || "",
      });
    }
  }, [shopProfileData]);

  // Update sales persons when staff data is loaded
  useEffect(() => {
    if (staffData?.data) {
      const staffList = Array.isArray(staffData.data.staff) ? staffData.data.staff : [staffData.data.staff];
      const mappedStaff: SalesPerson[] = staffList.map((staff) => ({
        id: staff._id,
        name: staff.staffName,
        phoneNumber: staff.phoneNumber,
        role: staff.role,
        canAddSales: true, // Default permissions
        canAddExpense: staff.role === "manager",
      }));
      setSalesPersons(mappedStaff);
    }
  }, [staffData]);

  const handleRetry = () => {
  refetchShop();
  refetchStaff();
};

  if (isLoadingShop || isLoadingStaff) {
    return <LoadingState text="Loading expenses..." size="lg" />;
  }

  if (shopError || staffError) {
  return (
      <ErrorState 
        message="Failed to load shop information. Please try again." 
        onRetry={handleRetry}
      />
  );
}
  // Handle business info update
  const handleUpdateBusinessInfo = async (info: BusinessInfo) => {
    // TODO: Replace with your API call
    // await updateBusinessInfo(info).unwrap();
    setBusinessInfo(info);
    if (!user?.userId) {
      toast.error("Shop information is missing. Please relogin and try again.");
      return;
    }

    try {
      const payload = {
        address: info.address,
        businessType: info.businessType,
        email: info.email,
        phoneNumber: formatNigerianPhoneNumber(info.phoneNumber),
        shopName: info.businessName
      };

      const result = await updateProfile({ shopId: user.shopId, data: payload }).unwrap();
      console.log(result)
      setBusinessInfo(info);
    } catch (error) {
      handleApiError(error);
      (error as any).__handled = true;
      throw error;
    }
  };

  // Handle add sales person
  const handleAddPerson = async (person: SalesPersonFormValues) => {
    if (!user?.userId) {
      toast.error("Shop information is missing. Please relogin and try again.");
      return;
    }

    const role = person.canAddSales && person.canAddExpense ? "manager" : "staff";

    try {
      const payload = {
        shopId: user.shopId,
        staffName: person.name.trim(),
        phoneNumber: formatNigerianPhoneNumber(person.phoneNumber),
        password: person.password,
        role,
      };

      const response = await createStaff(payload).unwrap();

      const newPerson: SalesPerson = {
        id: response.data._id,
        name: response.data.staffName,
        phoneNumber: response.data.phoneNumber,
        role: response.data.role,
        canAddSales: person.canAddSales,
        canAddExpense: person.canAddExpense,
      };

      setSalesPersons((prev) => [...prev, newPerson]);
    } catch (error) {
      handleApiError(error);
      (error as any).__handled = true;
      throw error;
    }
  };

  // Handle update sales person
  const handleUpdatePerson = async (
    id: string,
    updates: Partial<SalesPerson>
  ) => {
    if (!user?.shopId) {
      toast.error("Shop information is missing. Please relogin and try again.");
      return;
    }

    try {
      const role = updates.canAddSales && updates.canAddExpense ? "manager" : "staff";

      const payload = {
        ...(updates.name && { staffName: updates.name.trim() }),
        ...(updates.phoneNumber && { 
          phoneNumber: formatNigerianPhoneNumber(updates.phoneNumber) 
        }),
        role,
      };

      await updateStaff({ 
        shopId: user.shopId, 
        staffId: id, 
        data: payload 
      }).unwrap();

      setSalesPersons((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      
      toast.success("Sales person updated successfully!");
    } catch (error) {
      handleApiError(error);
      (error as any).__handled = true;
      throw error;
    }
  };

  // Handle delete sales person
  const handleDeletePerson = async (id: string) => {
    if (!user?.shopId) {
      toast.error("Shop information is missing. Please relogin and try again.");
      return;
    }

    try {
      await deleteStaff({ 
        shopId: user.shopId, 
        staffId: id 
      }).unwrap();

      setSalesPersons((prev) => prev.filter((p) => p.id !== id));
      toast.success("Sales person removed successfully!");
    } catch (error) {
      handleApiError(error);
      (error as any).__handled = true;
      throw error;
    }
  };

  // Show loading state while fetching initial data
  if (isLoadingShop || isLoadingStaff) {
    return (
      <section className="py-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-3"></div>
            <p className="text-gray-500">Loading shop information...</p>
          </div>
        </div>
      </section>
    );
  }

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
        isLoading={isUpdatingProfile}
      />

      {/* Sales Team Card */}
      <SalesTeamCard
        salesPersons={salesPersons}
        maxPersons={5}
        onAddPerson={handleAddPerson}
        onUpdatePerson={handleUpdatePerson}
        onDeletePerson={handleDeletePerson}
        isSubmitting={isCreatingStaff || isUpdatingStaff || isDeletingStaff}
      />
    </section>
  );
};