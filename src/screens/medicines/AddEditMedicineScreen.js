// GVR Pharma IMS — AddEditMedicineScreen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { selectMedicineById } from '../../store/slices/medicinesSlice';
import COLORS from '../../constants/colors';

const CATEGORIES = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment'];

const AddEditMedicineScreen = ({ route, navigation }) => {
  const { medicineId } = route.params ?? {};
  const isEditMode  = Boolean(medicineId);
  const existing    = useSelector(selectMedicineById(medicineId));

  // Form state
  const [name,         setName]         = useState('');
  const [category,     setCategory]     = useState('Tablet');
  const [manufacturer, setManufacturer] = useState('');
  const [batchNumber,  setBatchNumber]  = useState('');
  const [stock,        setStock]        = useState('');
  const [price,        setPrice]        = useState('');
  const [expiryDate,   setExpiryDate]   = useState('');
  const [description,  setDescription]  = useState('');

  const [submitting,   setSubmitting]   = useState(false);
  const [errors,       setErrors]       = useState({});
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMsg,     setSnackMsg]     = useState('');

  // Category picker open state (simple inline selector)
  const [catOpen, setCatOpen] = useState(false);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (isEditMode && existing) {
      setName(existing.name ?? '');
      setCategory(existing.category ?? 'Tablet');
      setManufacturer(existing.manufacturer ?? '');
      setBatchNumber(existing.batchNumber ?? '');
      setStock(String(existing.stock ?? ''));
      setPrice(String(existing.price ?? ''));
      setExpiryDate(existing.expiryDate ?? '');
      setDescription(existing.description ?? '');
    }
  }, [isEditMode, existing]);

  const validate = () => {
    const errs = {};
    if (!name.trim())            errs.name        = 'Medicine name is required.';
    if (!batchNumber.trim())     errs.batchNumber  = 'Batch number is required.';
    if (stock === '' || isNaN(Number(stock)) || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      errs.stock = 'Stock must be a non-negative whole number.';
    }
    if (price !== '' && (isNaN(Number(price)) || Number(price) < 0)) {
      errs.price = 'Price must be a positive number.';
    }
    if (expiryDate) {
      const expDate = new Date(expiryDate);
      if (isNaN(expDate.getTime())) {
        errs.expiryDate = 'Enter a valid date (YYYY-MM-DD).';
      } else if (expDate <= new Date()) {
        errs.expiryDate = 'Expiry date must be in the future.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      const data = {
        name:         name.trim(),
        category,
        manufacturer: manufacturer.trim(),
        batchNumber:  batchNumber.trim(),
        stock:        parseInt(stock, 10),
        price:        price ? parseFloat(price) : 0,
        expiryDate:   expiryDate.trim(),
        description:  description.trim(),
        updatedAt:    serverTimestamp(),
      };

      if (isEditMode) {
        await updateDoc(doc(db, 'medicines', medicineId), data);
        setSnackMsg('Medicine updated successfully!');
      } else {
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, 'medicines'), data);
        setSnackMsg('Medicine added successfully!');
      }

      setSnackVisible(true);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err) {
      Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'add'} medicine: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const inputProps = {
    mode:             'outlined',
    outlineColor:     COLORS.border,
    activeOutlineColor: COLORS.primary,
    style:            styles.input,
    disabled:         submitting,
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Medicine Information</Text>

        {/* Medicine Name */}
        <TextInput
          {...inputProps}
          label="Medicine Name *"
          value={name}
          onChangeText={setName}
          error={Boolean(errors.name)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Category Selector */}
        <View style={styles.catContainer}>
          <Text style={styles.catLabel}>Category *</Text>
          <View style={styles.catChips}>
            {CATEGORIES.map((cat) => {
              const active = cat === category;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[styles.catChip, active && styles.catChipActive]}
                  disabled={submitting}
                >
                  <Text style={[styles.catChipText, active && styles.catChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Manufacturer */}
        <TextInput
          {...inputProps}
          label="Manufacturer"
          value={manufacturer}
          onChangeText={setManufacturer}
        />

        <Text style={styles.sectionLabel}>Inventory Details</Text>

        {/* Batch Number */}
        <TextInput
          {...inputProps}
          label="Batch Number *"
          value={batchNumber}
          onChangeText={setBatchNumber}
          error={Boolean(errors.batchNumber)}
          autoCapitalize="characters"
        />
        {errors.batchNumber && <Text style={styles.errorText}>{errors.batchNumber}</Text>}

        {/* Stock */}
        <TextInput
          {...inputProps}
          label="Stock Quantity *"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
          error={Boolean(errors.stock)}
        />
        {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}

        {/* Price */}
        <TextInput
          {...inputProps}
          label="Price (₹)"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          error={Boolean(errors.price)}
          left={<TextInput.Affix text="₹" />}
        />
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

        {/* Expiry Date */}
        <TextInput
          {...inputProps}
          label="Expiry Date (YYYY-MM-DD)"
          value={expiryDate}
          onChangeText={setExpiryDate}
          placeholder="e.g. 2027-06-30"
          error={Boolean(errors.expiryDate)}
        />
        {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}

        <Text style={styles.sectionLabel}>Additional Info</Text>

        {/* Description */}
        <TextInput
          {...inputProps}
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.multilineInput]}
        />

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.submitBtn}
          contentStyle={styles.submitBtnContent}
          labelStyle={styles.submitBtnLabel}
          buttonColor={COLORS.primary}
          icon={isEditMode ? 'pencil' : 'plus'}
        >
          {submitting
            ? isEditMode ? 'Updating...' : 'Adding...'
            : isEditMode ? 'Update Medicine' : 'Add Medicine'}
        </Button>
      </ScrollView>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={1500}
        style={styles.snackbar}
      >
        {snackMsg}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding:       20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize:     13,
    fontWeight:   '700',
    color:        COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop:    20,
    marginBottom:  8,
  },
  input: {
    marginBottom:    12,
    backgroundColor: COLORS.surface,
  },
  multilineInput: {
    minHeight: 100,
  },
  errorText: {
    color:        COLORS.danger,
    fontSize:     12,
    marginTop:    -8,
    marginBottom: 10,
    marginLeft:   4,
  },
  catContainer: {
    marginBottom: 12,
  },
  catLabel: {
    fontSize:   13,
    fontWeight: '600',
    color:      COLORS.textMuted,
    marginBottom: 8,
  },
  catChips: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    gap:            8,
  },
  catChip: {
    borderRadius:    20,
    paddingHorizontal: 14,
    paddingVertical:   7,
    backgroundColor:   COLORS.surface,
    borderWidth:       1.5,
    borderColor:       COLORS.border,
  },
  catChipActive: {
    backgroundColor: COLORS.primary,
    borderColor:     COLORS.primary,
  },
  catChipText: {
    fontSize:   13,
    fontWeight: '600',
    color:      COLORS.textMuted,
  },
  catChipTextActive: {
    color: COLORS.white,
  },
  submitBtn: {
    marginTop:    20,
    borderRadius: 12,
    elevation:    3,
  },
  submitBtnContent: {
    paddingVertical: 6,
  },
  submitBtnLabel: {
    fontSize:   16,
    fontWeight: '700',
  },
  snackbar: {
    backgroundColor: COLORS.success,
  },
});

export default AddEditMedicineScreen;
