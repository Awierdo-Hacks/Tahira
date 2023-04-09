import { useEffect, useState } from 'react';
import { Status, checkIfHalal } from '../utils/checkHalal';

export function useProduct() {
  const [id, setID] = useState<string>();
  const [found, setFound] = useState<boolean>();
  const [additives, setAdditives] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>();

  useEffect(() => {
    if (found) return;
    setAdditives([]);
    setStatus(undefined);
  }, [found]);

  const set = (ID: string) => {
    setID(ID);
    setAdditives([]);
    setStatus(undefined);
    return fetch(`https://world.openfoodfacts.org/api/v0/product/${ID}.json`)
      .then((res) => res.json())
      .then((data) => {
        setFound(data.status_verbose === 'product found');
        if (data.status_verbose === 'product found') {
          setAdditives(
            (data.product?.additives_tags ?? []).map(
              (v: string) => 'E' + v.slice(v.indexOf(':') + 2)
            )
          );
          setStatus(checkIfHalal(additives));
        }
        return { ID, found, additives, status };
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };
  return {
    id,
    found,
    additives,
    status,
    set,
  };
}
