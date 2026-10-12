import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
} from 'react-native';

const COURSES = ['Starter', 'Main', 'Dessert', 'Drink', 'Side'];

const initialItems = [
  {
    id: 'sample-1',
    name: 'Creamy Mushroom Pasta',
    description: 'Pasta with mushrooms in a creamy garlic sauce.',
    course: 'Main',
    price: 95.00,
  },
  {
    id: 'sample-2',
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie served as a sweet treat.',
    course: 'Dessert',
    price: 48.00,
  },
];

function formatPrice(value) {
  return `R ${Number(value).toFixed(2)}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('menu');
  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Main');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');

  const totalItems = items.length;
  const menuSummary = useMemo(() => {
    const counts = {};
    items.forEach((item) => {
      counts[item.course] = (counts[item.course] || 0) + 1;
    });
    return counts;
  }, [items]);

  function resetForm() {
    setName('');
    setDescription('');
    setCourse('Main');
    setPrice('');
    setErrors({});
    setNotice('');
  }

  function validateForm() {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Please enter a dish name.';
    if (!description.trim()) nextErrors.description = 'Please enter a short description.';
    if (!course) nextErrors.course = 'Please choose a course.';
    if (!price.trim()) {
      nextErrors.price = 'Please enter a price.';
    } else {
      const numericPrice = Number(price.replace(',', '.'));
      if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        nextErrors.price = 'Enter a valid price greater than R 0.00.';
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function addMenuItem() {
    setNotice('');
    if (!validateForm()) {
      Alert.alert('Check the form', 'Please correct the highlighted fields before saving.');
      return;
    }

    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      description: description.trim(),
      course,
      price: Number(price.replace(',', '.')),
    };

    setItems((currentItems) => [newItem, ...currentItems]);
    resetForm();
    setActiveTab('menu');
    setNotice(`${newItem.name} was added successfully.`);
    Alert.alert('Menu item added', `${newItem.name} has been added to your menu.`);
  }

  function openAddForm() {
    resetForm();
    setActiveTab('add');
  }

  function renderFieldError(field) {
    return errors[field] ? <Text style={styles.errorText}>{errors[field]}</Text> : null;
  }

  function renderMenuItem(item) {
    return (
      <View key={item.id} style={styles.menuCard}>
        <View style={styles.cardTopRow}>
          <View style={styles.courseBadge}>
            <Text style={styles.courseBadgeText}>{item.course}</Text>
          </View>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
        </View>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishDescription}>{item.description}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#163D2A" />
      <View style={styles.header}>
        <View style={styles.logoMark}>
          <Text style={styles.logoEmoji}>🍽</Text>
        </View>
        <View style={styles.headerTextWrap}>
          <Text style={styles.eyebrow}>RESTAURANT MANAGEMENT</Text>
          <Text style={styles.headerTitle}>Chef's Menu Manager</Text>
          <Text style={styles.headerSubtitle}>Keep every dish organised.</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => { setActiveTab('menu'); setNotice(''); }}
          style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>Menu items</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={openAddForm}
          style={[styles.tab, activeTab === 'add' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>＋ Add a dish</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'menu' ? (
            <>
              <View style={styles.welcomeRow}>
                <View style={styles.flex}>
                  <Text style={styles.pageTitle}>Your menu</Text>
                  <Text style={styles.pageSubtitle}>A clear view of the dishes you've added.</Text>
                </View>
                <Pressable style={styles.primaryButtonSmall} onPress={openAddForm}>
                  <Text style={styles.primaryButtonSmallText}>＋ Add</Text>
                </Pressable>
              </View>

              {notice ? (
                <View style={styles.successBanner}>
                  <Text style={styles.successIcon}>✓</Text>
                  <Text style={styles.successText}>{notice}</Text>
                </View>
              ) : null}

              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Text style={styles.summaryEmoji}>🥗</Text>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.summaryLabel}>TOTAL MENU ITEMS</Text>
                  <Text style={styles.summaryNumber}>{totalItems}</Text>
                  <Text style={styles.summaryHint}>Across {Object.keys(menuSummary).length} course {Object.keys(menuSummary).length === 1 ? 'type' : 'types'}</Text>
                </View>
              </View>

              <View style={styles.sectionHeadingRow}>
                <Text style={styles.sectionTitle}>All dishes</Text>
                <Text style={styles.itemCount}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</Text>
              </View>

              {items.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyEmoji}>🍴</Text>
                  <Text style={styles.emptyTitle}>Your menu is empty</Text>
                  <Text style={styles.emptyText}>Add your first dish to start building the restaurant menu.</Text>
                  <Pressable style={styles.primaryButton} onPress={openAddForm}>
                    <Text style={styles.primaryButtonText}>Add your first dish</Text>
                  </Pressable>
                </View>
              ) : (
                items.map(renderMenuItem)
              )}

              <Text style={styles.footerNote}>Chef's Menu Manager · Part 2 working version</Text>
            </>
          ) : (
            <>
              <Pressable style={styles.backLink} onPress={() => { setActiveTab('menu'); setNotice(''); }}>
                <Text style={styles.backLinkText}>‹  Back to menu</Text>
              </Pressable>
              <Text style={styles.pageTitle}>Add a dish</Text>
              <Text style={styles.pageSubtitle}>Enter the details below to add a new item to the menu.</Text>

              <View style={styles.formCard}>
                <Text style={styles.fieldLabel}>Dish name <Text style={styles.required}>*</Text></Text>
                <TextInput
                  value={name}
                  onChangeText={(value) => { setName(value); setErrors((old) => ({ ...old, name: undefined })); }}
                  placeholder="e.g. Grilled chicken"
                  placeholderTextColor="#9AA69D"
                  style={[styles.input, errors.name && styles.inputError]}
                  returnKeyType="next"
                  maxLength={60}
                />
                {renderFieldError('name')}

                <Text style={styles.fieldLabel}>Description <Text style={styles.required}>*</Text></Text>
                <TextInput
                  value={description}
                  onChangeText={(value) => { setDescription(value); setErrors((old) => ({ ...old, description: undefined })); }}
                  placeholder="Describe the dish and its ingredients"
                  placeholderTextColor="#9AA69D"
                  style={[styles.input, styles.descriptionInput, errors.description && styles.inputError]}
                  multiline
                  textAlignVertical="top"
                  maxLength={180}
                />
                <Text style={styles.helperText}>Keep it short and easy for the chef to recognise.</Text>
                {renderFieldError('description')}

                <Text style={styles.fieldLabel}>Course <Text style={styles.required}>*</Text></Text>
                <View style={styles.courseOptions}>
                  {COURSES.map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => { setCourse(option); setErrors((old) => ({ ...old, course: undefined })); }}
                      style={[styles.courseOption, course === option && styles.selectedCourseOption]}
                    >
                      <Text style={[styles.courseOptionText, course === option && styles.selectedCourseOptionText]}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
                {renderFieldError('course')}

                <Text style={styles.fieldLabel}>Price (ZAR) <Text style={styles.required}>*</Text></Text>
                <View style={[styles.priceInputWrap, errors.price && styles.inputError]}>
                  <Text style={styles.currencyPrefix}>R</Text>
                  <TextInput
                    value={price}
                    onChangeText={(value) => { setPrice(value); setErrors((old) => ({ ...old, price: undefined })); }}
                    placeholder="0.00"
                    placeholderTextColor="#9AA69D"
                    keyboardType="decimal-pad"
                    style={styles.priceInput}
                    maxLength={10}
                  />
                </View>
                {renderFieldError('price')}

                <View style={styles.formActions}>
                  <Pressable style={styles.cancelButton} onPress={() => { resetForm(); setActiveTab('menu'); }}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.primaryButton} onPress={addMenuItem}>
                    <Text style={styles.primaryButtonText}>Save menu item</Text>
                  </Pressable>
                </View>
                <Text style={styles.requiredNote}><Text style={styles.required}>*</Text> Required fields</Text>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#F5F7F3' },
  header: {
    backgroundColor: '#163D2A',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMark: {
    width: 54, height: 54, borderRadius: 17, backgroundColor: '#E5F0D8',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  logoEmoji: { fontSize: 27 },
  headerTextWrap: { flex: 1 },
  eyebrow: { color: '#BBD1B9', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  headerTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: '800', letterSpacing: -0.4 },
  headerSubtitle: { color: '#D9E5D7', fontSize: 12, marginTop: 4 },
  tabBar: {
    backgroundColor: '#FFFFFF', flexDirection: 'row', paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: '#E5EAE3',
  },
  tab: { paddingVertical: 15, marginRight: 24, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#4D7C45' },
  tabText: { color: '#7A877D', fontSize: 13, fontWeight: '700' },
  activeTabText: { color: '#214B32' },
  content: { padding: 20, paddingBottom: 36 },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  pageTitle: { color: '#1E3526', fontSize: 27, fontWeight: '800', letterSpacing: -0.7 },
  pageSubtitle: { color: '#78857A', fontSize: 13, lineHeight: 19, marginTop: 5, marginBottom: 20 },
  primaryButtonSmall: { backgroundColor: '#244F34', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 11, marginLeft: 10 },
  primaryButtonSmallText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  successBanner: { backgroundColor: '#E5F5E8', borderColor: '#BFE4C5', borderWidth: 1, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  successIcon: { color: '#24723B', fontWeight: '900', fontSize: 16, marginRight: 9 },
  successText: { color: '#246638', fontSize: 12, fontWeight: '700', flex: 1 },
  summaryCard: {
    backgroundColor: '#E8F0E2', borderRadius: 18, padding: 18, flexDirection: 'row',
    alignItems: 'center', marginBottom: 26,
  },
  summaryIcon: { width: 56, height: 56, borderRadius: 17, backgroundColor: '#D2E3C8', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  summaryEmoji: { fontSize: 27 },
  summaryLabel: { color: '#60745F', fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  summaryNumber: { color: '#1F492F', fontSize: 30, fontWeight: '900', marginTop: 2 },
  summaryHint: { color: '#60745F', fontSize: 12, marginTop: 1 },
  sectionHeadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: '#25392B', fontSize: 18, fontWeight: '800' },
  itemCount: { color: '#7A877D', fontSize: 12, fontWeight: '600' },
  menuCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#E8ECE6',
    shadowColor: '#1D3925', shadowOpacity: 0.035, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  courseBadge: { backgroundColor: '#EEF4E9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  courseBadgeText: { color: '#416B3E', fontSize: 10, fontWeight: '800' },
  price: { color: '#245235', fontSize: 15, fontWeight: '900' },
  dishName: { color: '#24392A', fontSize: 16, fontWeight: '800', marginBottom: 5 },
  dishDescription: { color: '#758176', fontSize: 12, lineHeight: 18 },
  emptyState: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E8ECE6' },
  emptyEmoji: { fontSize: 38, marginBottom: 10 },
  emptyTitle: { color: '#25392B', fontSize: 17, fontWeight: '800', marginBottom: 7 },
  emptyText: { color: '#758176', fontSize: 13, lineHeight: 19, textAlign: 'center', marginBottom: 18 },
  footerNote: { color: '#9AA59A', fontSize: 10, textAlign: 'center', marginTop: 22 },
  backLink: { alignSelf: 'flex-start', paddingVertical: 4, marginBottom: 15 },
  backLinkText: { color: '#426D45', fontSize: 13, fontWeight: '800' },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#E8ECE6' },
  fieldLabel: { color: '#314536', fontSize: 13, fontWeight: '800', marginBottom: 8, marginTop: 14 },
  required: { color: '#B64C3B' },
  input: { minHeight: 48, borderWidth: 1, borderColor: '#DDE4DA', borderRadius: 11, paddingHorizontal: 13, paddingVertical: 12, color: '#26392B', fontSize: 14, backgroundColor: '#FCFDFC' },
  inputError: { borderColor: '#C95C4D', backgroundColor: '#FFF9F8' },
  descriptionInput: { minHeight: 95 },
  helperText: { color: '#8A958B', fontSize: 11, marginTop: 6 },
  errorText: { color: '#B54437', fontSize: 11, marginTop: 6, fontWeight: '600' },
  courseOptions: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 1, marginBottom: 1 },
  courseOption: { borderWidth: 1, borderColor: '#DDE4DA', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 9, marginRight: 7, marginBottom: 7, backgroundColor: '#FFFFFF' },
  selectedCourseOption: { backgroundColor: '#E8F1E2', borderColor: '#4D7C45' },
  courseOptionText: { color: '#667468', fontSize: 12, fontWeight: '700' },
  selectedCourseOptionText: { color: '#2D5B35' },
  priceInputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDE4DA', borderRadius: 11, backgroundColor: '#FCFDFC', paddingLeft: 14 },
  currencyPrefix: { color: '#5F7463', fontSize: 15, fontWeight: '800', marginRight: 8 },
  priceInput: { flex: 1, minHeight: 48, paddingHorizontal: 4, paddingVertical: 12, color: '#26392B', fontSize: 14 },
  formActions: { flexDirection: 'row', alignItems: 'center', marginTop: 25 },
  cancelButton: { paddingVertical: 14, paddingHorizontal: 17, borderRadius: 11, borderWidth: 1, borderColor: '#DDE4DA', marginRight: 10 },
  cancelButtonText: { color: '#5F6E61', fontSize: 13, fontWeight: '800' },
  primaryButton: { flex: 1, backgroundColor: '#244F34', borderRadius: 11, paddingVertical: 14, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  requiredNote: { color: '#879287', fontSize: 10, marginTop: 14 },
});
