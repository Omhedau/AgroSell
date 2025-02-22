import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {

   const text_primaryColor = "#2C7F30"; //Dark Green Color
   const primaryColor = "#4ADE80";   // Light green for active tab background
   const primaryColor_300 = "#84EC84"  
   const primaryColor_400 = "#32C338"; 
   const primaryColor_500 = "#2C7F30"; 
   const greyColor = "#737373"; // Gray for inactive tab background
  
  const icons: { [key: string]: string } = {
    home: "home",
    sell: "construct",
    "(ecom)": "cart",
    "(crop)": "leaf",
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbarItem}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: isFocused ? primaryColor_400 : "#E5E7EB" }, // Light gray for inactive
              ]}
            >
              <Ionicons
                name={
                  icons[
                    route.name as keyof typeof icons
                  ] as keyof typeof Ionicons.glyphMap
                }
                size={22} // Slightly reduced icon size for a compact look
                color={isFocused ? "#fff" : greyColor} // White icon for active, gray for inactive
              />
            </View>
            <Text
             className="font-rubik"
              style={[
                styles.tabbarLabel,
                { color: isFocused ? text_primaryColor : greyColor },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",  //"#E8F8E8",
    // marginHorizontal: 5, // Adjusted margin for a smaller width
    paddingVertical: 10, // Reduced padding for a smaller height
    paddingHorizontal: 8,
    borderTopLeftRadius: 20, // Rounded only the top-left corner
    borderTopRightRadius: 20, // Rounded only the top-right corner
    shadowColor: "black",
    shadowOffset: { width: 0, height: 6 }, // Adjusted shadow for compact height
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 3,
    width: "100%",
  },
  tabbarItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36, // Reduced size for a smaller icon container
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  tabbarLabel: {
    fontSize: 11, // Slightly smaller font size
    fontWeight: "600",
    marginTop: 3, // Reduced margin for a compact look
  },
});

export default TabBar;
