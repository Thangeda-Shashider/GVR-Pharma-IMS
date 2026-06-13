// GVR Pharma IMS — MedicineListScreen
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { FAB } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { selectMedicines, selectMedLoading, selectMedError } from '../../store/slices/medicinesSlice';
import { selectUserRole } from '../../store/slices/authSlice';
import { getPermissions } from '../../constants/roles';
import COLORS from '../../constants/colors';
import SearchBar from '../../components/SearchBar';
import MedicineCard from '../../components/MedicineCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import useMedicines from '../../hooks/useMedicines';
import useAlerts from '../../hooks/useAlerts';

const CATEGORIES = ['All', 'Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment'];

const MedicineListScreen = ({ navigation }) => {
  const medicines  = useSelector(selectMedicines);
  const loading    = useSelector(selectMedLoading);
  const error      = useSelector(selectMedError);
  const role       = useSelector(selectUserRole);
  const perms      = getPermissions(role);

  useMedicines();
  useAlerts();

  const [search,          setSearch]          = useState('');
  const [activeCategory,  setActiveCategory]  = useState('All');

  // Filtered list
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchSearch   = m.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === 'All' || m.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [medicines, search, activeCategory]);

  if (loading && medicines.length === 0) {
    return <LoadingSpinner message="Loading medicines..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={56} color={COLORS.danger} />
        <Text style={styles.errorTitle}>Failed to load medicines</Text>
        <Text style={styles.errorMsg}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <MedicineCard
      medicine={item}
      onPress={() =>
        navigation.navigate('MedicineDetail', { medicineId: item.id })
      }
    />
  );

  const ListHeader = () => (
    <>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search by medicine name..."
      />
      {/* Category filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {CATEGORIES.map((cat) => {
          const active = cat === activeCategory;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Result count */}
      <Text style={styles.resultCount}>
        {filteredMedicines.length} medicine{filteredMedicines.length !== 1 ? 's' : ''}
      </Text>
    </>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No medicines found</Text>
      <Text style={styles.emptySubtitle}>
        {search
          ? `No results for "${search}"`
          : 'No medicines in this category yet.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredMedicines}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB — admin only */}
      {perms.canAdd && (
        <FAB
          icon="plus"
          style={styles.fab}
          color={COLORS.white}
          onPress={() => navigation.navigate('AddEditMedicine', {})}
          label="Add Medicine"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 100,
  },
  chipsRow: {
    paddingHorizontal: 16,
    paddingBottom:     8,
    gap:               8,
  },
  chip: {
    borderRadius:    20,
    paddingHorizontal: 16,
    paddingVertical:   7,
    backgroundColor:   COLORS.surface,
    borderWidth:       1,
    borderColor:       COLORS.border,
    marginRight:       6,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor:     COLORS.primary,
  },
  chipText: {
    fontSize:   13,
    fontWeight: '600',
    color:      COLORS.textMuted,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  resultCount: {
    fontSize:        13,
    color:           COLORS.textMuted,
    paddingHorizontal: 20,
    marginBottom:    8,
    fontWeight:      '500',
  },
  emptyContainer: {
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize:   18,
    fontWeight: '700',
    color:      COLORS.textPrimary,
    marginTop:  16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize:  14,
    color:     COLORS.textMuted,
    textAlign: 'center',
  },
  errorContainer: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: COLORS.background,
    padding:         32,
  },
  errorTitle: {
    fontSize:   18,
    fontWeight: '700',
    color:      COLORS.textPrimary,
    marginTop:  16,
  },
  errorMsg: {
    fontSize:  13,
    color:     COLORS.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position:        'absolute',
    bottom:          24,
    right:           20,
    backgroundColor: COLORS.primary,
    borderRadius:    16,
  },
});

export default MedicineListScreen;
