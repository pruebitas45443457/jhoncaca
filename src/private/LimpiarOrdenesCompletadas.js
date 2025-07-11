import { useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

function LimpiarOrdenesCompletadas() {
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const comprasRef = collection(db, 'compras');
        const q = query(comprasRef, where('completado', '==', true));
        const querySnapshot = await getDocs(q);

        for (const docSnap of querySnapshot.docs) {
          const ordenData = docSnap.data();

          // 1. Copiar a RegistroVentas
          await addDoc(collection(db, 'RegistroVentas'), {
            ...ordenData,
            originalId: docSnap.id,
            fechaRegistro: new Date(),
          });

          // 2. Eliminar de compras
          await deleteDoc(doc(db, 'compras', docSnap.id));
        }

      } catch (error) {
        console.error('Error al limpiar órdenes completadas:', error);
      }
    }, 10000); // cada 10 segundos

    return () => clearInterval(intervalId); // limpiar el intervalo al desmontar
  }, []);

  return null; // No renderiza nada visualmente
}

export default LimpiarOrdenesCompletadas;
