import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecipeScreen from '../screens/RecipeScreen';
import ReceiptScanScreen from '../screens/ReceiptScanScreen';
import IngredientAddScreen from '../screens/IngredientAddScreen';
import FridgePutScreen from '../screens/FridgePutScreen';
import MyIngredientsGrid from '../components/MyIngredientsGrid'; // ✅ 추가

const Stack = createNativeStackNavigator();

export default function RecipeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecipeHome" component={RecipeScreen} />
      <Stack.Screen name="ReceiptScan" component={ReceiptScanScreen} />
      <Stack.Screen name="IngredientAdd" component={IngredientAddScreen} />
      <Stack.Screen name="FridgePut" component={FridgePutScreen} />
      <Stack.Screen name="MyIngredients" component={MyIngredientsGrid} />
    </Stack.Navigator>
  );
}
