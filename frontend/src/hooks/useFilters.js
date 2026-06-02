import { useState, useMemo } from "react";

/**
 * Hook personnalisé pour gérer les filtres des chambres
 *
 * @param {Array} rooms - Liste complète des chambres
 * @returns {{ filteredRooms, filters, setFilter, resetFilters }}
 */
export default function useFilters(rooms) {
  const [filters, setFilters] = useState({
    city: "",
    district: "",
    type: "",
    availability: "",
  });

  /**
   * Met à jour un filtre spécifique
   */
  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Réinitialise tous les filtres
   */
  const resetFilters = () => {
    setFilters({
      city: "",
      district: "",
      type: "",
      availability: "",
    });
  };

  /**
   * Liste filtrée (mémorisée pour les performances)
   */
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Filtre par ville
      if (filters.city && room.city !== filters.city) return false;

      // Filtre par quartier
      if (filters.district && room.district !== filters.district) return false;

      // Filtre par type de chambre
      if (filters.type && room.type !== filters.type) return false;

      // Filtre par disponibilité
      if (filters.availability === "available" && !room.available)
        return false;
      if (filters.availability === "unavailable" && room.available)
        return false;

      return true;
    });
  }, [rooms, filters]);

  /**
   * Quartiers disponibles selon la ville sélectionnée
   */
  const availableDistricts = useMemo(() => {
    const filtered = filters.city
      ? rooms.filter((r) => r.city === filters.city)
      : rooms;
    return [...new Set(filtered.map((r) => r.district))];
  }, [rooms, filters.city]);

  return {
    filteredRooms,
    filters,
    setFilter,
    resetFilters,
    availableDistricts,
  };
}
