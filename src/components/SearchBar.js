// GVR Pharma IMS — SearchBar Component
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

/**
 * @param {object}   props
 * @param {string}   props.value          — Current search text
 * @param {function} props.onChangeText   — Text change handler
 * @param {string}   [props.placeholder]  — Input placeholder text
 */
const SearchBar = ({ value, onChangeText, placeholder = 'Search medicines...' }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
          <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.surface,
    borderRadius:    12,
    paddingHorizontal: 12,
    paddingVertical:   8,
    marginHorizontal:  16,
    marginVertical:    10,
    elevation:        2,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 1 },
    shadowOpacity:    0.08,
    shadowRadius:     4,
    borderWidth:      1,
    borderColor:      COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex:       1,
    fontSize:   15,
    color:      COLORS.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    marginLeft: 8,
    padding:    2,
  },
});

export default SearchBar;
