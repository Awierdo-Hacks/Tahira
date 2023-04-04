import { Button, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useEffect, useState } from 'react';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ECODES } from '../../utils/ecodes';

export default function TabScanScreen() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [productData, setProductData] = useState<any>({});

  useEffect(() => {
    const getBarcodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarcodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`)
      .then((res) => res.json())
      .then((data) => setProductData(data));
  };

  const checkIfHalal = (ecodes: string[]): [string, string | undefined] => {
    let foundmushbooh = undefined;
    for (const ecode of ecodes) {
      const foundECode = ECODES.filter(
        (e) => e.ecode.slice(1) == ecode.slice(ecode.indexOf(':') + 2)
      );
      if (foundECode.length == 1) {
        if (foundECode[0].status == 'mushbooh')
          foundmushbooh = foundECode[0].ecode;
        if (foundECode[0].status == 'haram')
          return ['haram', foundECode[0].ecode];
      }
    }
    if (foundmushbooh) return ['mushbooh', foundmushbooh];
    return ['halal', undefined];
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ ...styles.container }}>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {!scanned ? (
        <>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </>
      ) : (
        <>
          <Button
            title={'Tap to Scan Again'}
            onPress={() => setScanned(false)}
          />
          <ScrollView>
            {/* <Text>{JSON.stringify(productData, null, 4)}</Text> */}
            {productData.status_verbose !== 'product found' ? (
              <Text>Product Not Found</Text>
            ) : (
              <>
                <Text>
                  Additives: {productData.product.additives_tags.toString()}
                </Text>
                <Text>
                  {checkIfHalal(productData.product.additives_tags)[0]}{' '}
                  {checkIfHalal(productData.product.additives_tags)[1] ? (
                    <>
                      because of{' '}
                      {checkIfHalal(productData.product.additives_tags)[1]}
                    </>
                  ) : null}
                </Text>
              </>
            )}
          </ScrollView>
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
