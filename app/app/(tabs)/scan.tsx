import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useEffect, useState } from 'react';

import { Text, View } from '../../components/Themed';
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import { Status, checkIfHalal } from '../../utils/checkHalal';
import { useProduct } from '../../hooks/useProduct';

export default function TabScanScreen() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [backgroundColor, setBackgroundColor] = useState<string>();
  const product = useProduct();

  useEffect(() => {
    const getBarcodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarcodeScannerPermissions();
  }, []);

  useEffect(() => {
    if (product?.status == undefined) {
      setBackgroundColor(undefined);
      return;
    }
    if (product.status.status == 'Halal') setBackgroundColor('green');
    else if (product.status.status == 'Haram') setBackgroundColor('red');
    else if (product.status.status == 'Mushbooh') setBackgroundColor('orange');
    else setBackgroundColor(undefined);
  }, [product.status]);

  const handleBarCodeScanned = ({ type, data }: BarCodeEvent) => {
    console.log(type, data);
    setScanned(true);
    setError(undefined);
    setLoading(true);
    product.set(data).catch((err) => setError(err));
    setLoading(false);
  };

  if (hasPermission === null) {
    return null;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No access to camera</Text>;
      </View>
    );
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor,
      }}
    >
      <View
        style={{
          ...styles.separator,
          backgroundColor,
        }}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {!scanned ? (
        <>
          <BarCodeScanner
            barCodeTypes={[
              BarCodeScanner.Constants.BarCodeType.ean13,
              BarCodeScanner.Constants.BarCodeType.ean8,
              BarCodeScanner.Constants.BarCodeType.upc_a,
              BarCodeScanner.Constants.BarCodeType.upc_e,
              BarCodeScanner.Constants.BarCodeType.upc_ean,
            ]}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </>
      ) : (
        <>
          {loading ? (
            <Text>Loading</Text>
          ) : (
            <>
              <View
                style={{
                  ...styles.container,
                  backgroundColor,
                }}
              >
                {error != undefined ? (
                  <Text>Error: {error.toString()}</Text>
                ) : (
                  <>
                    {!product.found ? (
                      <>
                        <Text style={styles.title}>Product Not Found</Text>
                        <Text>ID: {product.id}</Text>
                      </>
                    ) : (
                      <>
                        <Text
                          style={{
                            ...styles.title,
                            fontSize: 50,
                            marginHorizontal: 50,
                          }}
                        >
                          {product.status?.status ?? 'Halal'}
                        </Text>
                        {product.status?.becauseOf != undefined ? (
                          <Text style={{ fontSize: 20 }}>
                            {' '}
                            because of {product.status.becauseOf}
                          </Text>
                        ) : null}
                        <View
                          style={{
                            ...styles.separator,
                            backgroundColor,
                          }}
                          lightColor="#eee"
                          darkColor="rgba(255,255,255,0.1)"
                        />
                        {product.additives.length > 0 ? (
                          <>
                            <Text style={styles.title}>Additives</Text>
                            <FlatList
                              data={product.additives}
                              renderItem={({ item }) => <Text>{item}</Text>}
                            />
                          </>
                        ) : (
                          <Text>No Additives</Text>
                        )}
                      </>
                    )}
                  </>
                )}
              </View>
              <Button
                title={'Tap to Scan Again'}
                onPress={() => {
                  setScanned(false);
                  setBackgroundColor(undefined);
                }}
              />
              <View
                style={{
                  ...styles.separator,
                  marginVertical: 10,
                  backgroundColor,
                }}
                lightColor="#eee"
                darkColor="rgba(255,255,255,0.1)"
              />
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
