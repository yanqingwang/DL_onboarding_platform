import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

function App(): React.JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blue-Collar Onboarding</Text>
      <Text style={styles.subtitle}>Mobile App</Text>
      <Button 
        title={`Count: ${count}`} 
        onPress={() => setCount(count + 1)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
});

export default App;
