import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Instructions() {
  return (
    <View>
      <Text style={styles.text}>Connect a wallet to mint an NFT and claim 🏕️ TRAIL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Instructions; 