import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FolderLock, UploadCloud } from "lucide-react";
import { evidenceApi } from "../../api/evidenceApi";
import EvidenceCard from "../../components/evidence/EvidenceCard";
import EvidenceFilterBar from "../../components/evidence/EvidenceFilterBar";
import EmptyState from "../../components/common/EmptyState";
import { CardSkeleton } from "../../components/common/LoadingSkeleton";

export default function EvidenceVault() {
  const [evidenceList, setEvidenceList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    evidenceApi
      .getAll()
      .then(({ data }) => setEvidenceList(data))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return evidenceList.filter((e) => {
      const matchesSearch =
        !search ||
        e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.originalFilename?.toLowerCase().includes(search.toLowerCase()) ||
        e.sha256Hash?.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "ALL" || e.evidenceType === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "REGISTERED" && e.registered) ||
        (statusFilter === "PENDING" && !e.registered);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [evidenceList, search, typeFilter, statusFilter]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-headline-sm mb-1">Evidence Vault</h2>
          <p className="text-body-sm text-on-surface-variant">
            {evidenceList.length} item{evidenceList.length !== 1 && "s"} in the vault
          </p>
        </div>
        <Link
          to="/evidence/upload"
          className="flex items-center gap-2 bg-action text-action-on font-medium text-body-sm px-4 py-2.5 rounded hover:brightness-110 transition shrink-0"
        >
          <UploadCloud size={15} />
          Upload Evidence
        </Link>
      </div>

      <EvidenceFilterBar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {isLoading ? (
        <CardSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderLock}
          title={evidenceList.length === 0 ? "No evidence yet" : "No matches"}
          description={
            evidenceList.length === 0
              ? "Upload your first piece of evidence to get started."
              : "Try adjusting your search or filters."
          }
          action={
            evidenceList.length === 0 && (
              <Link
                to="/evidence/upload"
                className="bg-action text-action-on font-medium text-body-sm px-4 py-2.5 rounded hover:brightness-110 transition"
              >
                Upload Evidence
              </Link>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <EvidenceCard key={e.id} evidence={e} />
          ))}
        </div>
      )}
    </div>
  );
}