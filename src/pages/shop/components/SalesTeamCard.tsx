// ============================================
// 3. SalesTeamCard.tsx - Sales Team Management

import { Icon } from "@iconify/react";
import { useState } from "react";
import { SalesPersonModal } from "./SalesPersonModal";
import { SalesPersonItem } from "./SalesPersonItem";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

// ============================================
export interface SalesPerson {
    id: string;
    name: string;
    canAddSales: boolean;
    canAddExpense: boolean;
  }
  
  interface SalesTeamCardProps {
    salesPersons: SalesPerson[];
    maxPersons?: number;
    onAddPerson: (person: Omit<SalesPerson, "id">) => Promise<void>;
    onUpdatePerson: (id: string, person: Partial<SalesPerson>) => Promise<void>;
    onDeletePerson: (id: string) => Promise<void>;
  }
  
  export const SalesTeamCard: React.FC<SalesTeamCardProps> = ({
    salesPersons,
    maxPersons = 5,
    onAddPerson,
    onUpdatePerson,
    onDeletePerson,
  }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPerson, setEditingPerson] = useState<SalesPerson | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    return (
      <div className="py-4">
        {/* Header */}
        <h2 className="h4 text-secondary mb-2">
              Sales Team
        </h2>
        <div className="bg-white rounded-lg border border-secondary-5 p-6 flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon icon="mdi:account-group" width="20" height="20" />
              <span>Sales Persons</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {salesPersons.length}/{maxPersons}
            </p>
            <p className="text-xs text-gray-500">
              How many salespersons you have
            </p>
          </div>
  
          <button
            onClick={() => setShowAddModal(true)}
            className="hidden md:block btn btn-primary"
            disabled={salesPersons.length >= maxPersons}
          >
            Add Sales Person
          </button>
        </div>
  
        {/* Sales Persons List */}
        {salesPersons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-secondary-5">
            <Icon
              icon="mdi:account-group-outline"
              width="48"
              height="48"
              className="mx-auto text-gray-400 mb-3"
            />
            <p className="text-gray-900 font-medium mb-1">
              No sales persons added yet
            </p>
            <p className="text-sm text-gray-600 mb-7">
              Add your first team member to get started
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 btn btn-primary"
            >
              Add First Sales Person
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {salesPersons.map((person) => (
              <SalesPersonItem
                key={person.id}
                person={person}
                onEdit={() => setEditingPerson(person)}
                onDelete={() => setDeletingId(person.id)}
              />
            ))}
          </div>
        )}
  
        {/* Add/Edit Modal */}
        {(showAddModal || editingPerson) && (
          <SalesPersonModal
            person={editingPerson}
            onClose={() => {
              setShowAddModal(false);
              setEditingPerson(null);
            }}
            onSave={async (personData) => {
              if (editingPerson) {
                await onUpdatePerson(editingPerson.id, personData);
              } else {
                await onAddPerson(personData);
              }
              setShowAddModal(false);
              setEditingPerson(null);
            }}
          />
        )}

         {/* Delete Confirmation Modal */}
      {deletingId && (
        <DeleteConfirmModal
          personName={salesPersons.find((p) => p.id === deletingId)?.name || ""}
          onConfirm={async () => {
            await onDeletePerson(deletingId);
            setDeletingId(null);
          }}
          onCancel={() => setDeletingId(null)}
        />
      )}
      </div>
    );
  };