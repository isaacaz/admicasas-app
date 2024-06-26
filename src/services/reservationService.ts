import { IReservation } from "../types/reserve/reserve";
import { isWithinInterval, startOfMonth, subHours } from "date-fns";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import areaService from "./areaService";
import { IArea } from "@/types/area/area";
import { QueryFunctionContext } from "@tanstack/react-query";
import { th } from "date-fns/locale";

const FirestoreKey = "Reservation";

type GetAllDataQueryParams = {
  idhousing?: string;
  idcondominium: string;
  selectedDate?: Date;
  limitResults?: number;
};

// type contextType= {
//   queryKey: (string | {
//       idcondominium: string;
//       selectedDate?: Date | undefined;
//       limitResults?: number | undefined;
//   } | undefined)[];

//   pageParam: null | FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;

// }

type QueryContext = QueryFunctionContext<
  (string | GetAllDataQueryParams)[],
  any
>;

export const getAllData = async (context: any) => {
  try {
    //const Filter = firestore.Filter;
    const { pageParam = undefined, queryKey } = context;
    const [, , args] = queryKey;
    const { selectedDate, limitResults, idhousing } =
      args as GetAllDataQueryParams;

    let queryRef = firestore()
      .collection(FirestoreKey)
      .where("idhousing", "==", idhousing);

    if (pageParam) {
      queryRef = queryRef.startAfter(pageParam);
    }

    queryRef = queryRef.limit(limitResults || 3);

    const querySnapshot = await queryRef.get();

    const dataPromises: Promise<IReservation>[] = querySnapshot.docs.map(
      async (doc) => {
        const dataRef = doc.data() as IReservation;

        const area = await areaService.getData(dataRef.idarea);

        return {
          ...dataRef,
          areaName: area?.name,
          id: doc.id,
          //@ts-ignore
          start: subHours(dataRef.start.toDate(), 4),
          //@ts-ignore
          end: subHours(dataRef.end.toDate(), 4),
        } as IReservation;
      }
    );

    const data = await Promise.all(dataPromises);
    data.sort((a, b) => a.end.getTime() - b.end.getTime());

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return {
      data,
      lastDoc,
    };
  } catch (e: any) {
    console.log(e);
    throw new Error(e);
  }
};

export const getAllDataByHousing = async (context: any) => {
  try {
    const { pageParam = undefined, queryKey } = context;
    const [, , args] = queryKey;
    const {
      selectedDate,
      limitResults,
      idhousing = "",
    } = args as GetAllDataQueryParams;

    if (!idhousing) throw new Error("idcondominium is required");

    let queryRef = firestore()
      .collection(FirestoreKey)
      .where("idhousing", "==", idhousing)
      .orderBy("start", "desc");

    if (pageParam) {
      queryRef = queryRef.startAfter(pageParam);
    }

    if (selectedDate) {
      queryRef = queryRef.where(
        "startDetail.year",
        "==",
        selectedDate.getFullYear()
      );
      queryRef = queryRef.where(
        "startDetail.month",
        "==",
        selectedDate.getMonth()
      );
    }

    queryRef = queryRef.limit(limitResults || 3);

    const querySnapshot = await queryRef.get();

    const dataPromises: Promise<IReservation>[] = querySnapshot.docs.map(
      async (doc) => {
        const dataRef = doc.data() as IReservation;

        const area = await areaService.getData(dataRef.idarea);

        return {
          ...dataRef,
          areaName: area?.name,
          id: doc.id,
          //@ts-ignore
          start: subHours(dataRef.start.toDate(), 4),
          //@ts-ignore
          end: subHours(dataRef.end.toDate(), 4),
        } as IReservation;
      }
    );

    const data = await Promise.all(dataPromises);
    // data.sort((a, b) => a.end.getTime() - b.end.getTime());

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return {
      data,
      lastDoc,
    };
  } catch (error) {
    console.log(error);
  }
};

const getAllDataByCondominium = async (
  { idcondominium, selectedDate }: GetAllDataQueryParams = { idcondominium: "" }
) => {
  try {
    let queryRef = firestore()
      .collection(FirestoreKey)
      .where("idcondominium", "==", idcondominium)
      .where("state", "==", "Aprobado");
    const querySnapshot = await queryRef.get();

    const dataPromises: Promise<IReservation>[] = querySnapshot.docs.map(
      async (doc) => {
        const dataRef = doc.data() as IReservation;

        const area = await areaService.getData(dataRef.idarea);

        return {
          ...dataRef,
          areaName: area?.name,
          id: doc.id,
          //@ts-ignore
          start: new Date(dataRef.start.toDate()),
          //@ts-ignore
          end: new Date(dataRef.end.toDate()),
        } as IReservation;
      }
    );

    const data = await Promise.all(dataPromises);

    return data;
  } catch (e) {
    console.log(e);
  }
};

// const getAllDayData = async (
//   { idcondominium, selectedDate }: GetAllDataQueryParams = { idcondominium: "" }
// ) => {
//   try {
//     let queryRef = firestore()
//       .collection(FirestoreKey)
//       .where("idcondominium", "==", idcondominium)
//       .where("start", "==", selectedDate)
//       .where("end", "==", selectedDate);

//     const querySnapshot = await queryRef.get();

//     const data: IReservation[] = querySnapshot.docs.map((doc) => {
//       const data = doc.data() as IReservation;

//       return {
//         ...data,
//         id: doc.id,
//         //@ts-ignore
//         start: new Date(data.start.toDate()),
//         //@ts-ignore
//         end: new Date(data.end.toDate()),
//       };
//     });

//     return data;
//   } catch (e) {
//     console.log(e);
//   }
// };

const getData = async (id: string) => {
  try {
    const docRef = firestore().collection(FirestoreKey).doc(id);
    const docSnap = await docRef.get();

    const data = docSnap.data() as IReservation;

    return {
      ...data,
      id: docSnap.id,
      //@ts-ignore
      start: new Date(data.start.toDate()),
      //@ts-ignore
      end: new Date(data.end.toDate()),
    };
  } catch (e) {
    console.log(e);
  }
};

// const checkSameAreaInDate = async (data: IReservation, isUpdate = false) => {
//   console.log({
//     data,
//     isUpdate,
//   });
//   let queryRef = firestore()
//     .collection(FirestoreKey)
//     .where("idcondominium", "==", data.idcondominium)
//     .where("idarea", "==", data.idarea)
//     .where("startDetail.year", "==", data.startDetail.year)
//     .where("startDetail.month", "==", data.startDetail.month);

//   const areaReservations = await queryRef.get();

//   //  * Check if there is a reservation with the same area in same date
//   // const areaReservationQuery = query(
//   //   reservationsRef,
//   //   where("idcondominium", '==', data.idcondominium),
//   //   where("idarea", "==", data.idarea),
//   //   where("startDetail.year", "==", data.startDetail.year),
//   //   where("startDetail.month", "==", data.startDetail.month)
//   // );

//   // const areaReservations = await getDocs(areaReservationQuery);

//   if (areaReservations.size) {
//     const isDateOverlap = areaReservations.docs.some((doc) => {
//       if (isUpdate) {
//         if (data.id === doc.id) return false;
//       }

//       const dataReserva = doc.data() as IReservation;
//       console.log(dataReserva, "FECHA");
//       //@ts-ignore
//       const reservaInicio = new Date(dataReserva.start.toDate());
//       //@ts-ignore
//       const reservaFin = new Date(dataReserva.end.toDate());

//       return (
//         isWithinInterval(data.start, {
//           start: reservaInicio,
//           end: reservaFin,
//         }) ||
//         isWithinInterval(data.end, { start: reservaInicio, end: reservaFin })
//       );
//     });

//     if (isDateOverlap)
//       throw new Error(
//         "El area seleccionada ya cuenta con una reservacion en el misma dia/hora seleccionado"
//       );
//   }
// };

const checkSameAreaInDate = async (data: IReservation, isUpdate = false) => {
  console.log({
    data,
    isUpdate,
  });

  const currentDate = new Date();

  console.log("🚀 ~ checkSameAreaInDate ~ data.start :", data.start);
  if (data.start < currentDate) {
    console.log("aquiiiiiiii");
    throw new Error("La fecha de inicio debe ser mayor a la fecha actual");
  }

  let queryRef = firestore()
    .collection(FirestoreKey)
    .where("idcondominium", "==", data.idcondominium)
    .where("idarea", "==", data.idarea)
    .where("startDetail.year", "==", data.startDetail.year)
    .where("startDetail.month", "==", data.startDetail.month);

  const areaReservations = await queryRef.get();

  if (areaReservations.size) {
    const isDateOverlap = areaReservations.docs.some((doc) => {
      if (isUpdate) {
        if (data.id === doc.id) return false;
      }

      const dataReserva = doc.data() as IReservation;
      //@ts-ignore
      const reservaInicio = new Date(dataReserva.start.toDate());
      //@ts-ignore
      const reservaFin = new Date(dataReserva.end.toDate());

      return (
        isWithinInterval(data.start, {
          start: reservaInicio,
          end: reservaFin,
        }) ||
        isWithinInterval(data.end, { start: reservaInicio, end: reservaFin })
      );
    });

    if (isDateOverlap)
      throw new Error(
        "El area seleccionada ya cuenta con una reservacion en el misma dia/hora seleccionado"
      );
  }
};

const validateReservation = async (data: IReservation, isUpdate = false) => {
  await checkSameAreaInDate(data, isUpdate);
};

// const insertData = async (data: IReservation) => {
//   if (!data.idcondominium) {
//     throw new Error("idcondominium invalid or empty");
//   }

//   await validateReservation(data);

//   const document = await addDoc(collection(FirebaseDB, "Reservation"), data);
//   return document.id;
// };

const updateData = async (
  data: Partial<IReservation>,
  ignoreValidations = false
) => {
  if (!data.idcondominium) {
    throw new Error("idcondominium invalid or empty");
  }

  if (!ignoreValidations) await validateReservation(data as IReservation, true);

  try {
    const id = data.id;
    delete data.id;
    const docRef = firestore().collection(FirestoreKey).doc(id);
    await docRef.update(data);
  } catch (error: any) {
    console.error("Error al actualizar", error);
    throw new Error("No se pudo actualizar");
  }
};

const insertData = async (data: IReservation) => {
  await validateReservation(data);
  //const dataObj={...data,start:data.start.getTime(),end:data.end.getTime()}
  try {
    const doc = await firestore().collection(FirestoreKey).add(data);
    return doc.id;
  } catch (e: any) {
    console.log(e);
  }
};

const deleteData = async (id: string) => {
  try {
    await firestore().collection(FirestoreKey).doc(id).delete();
  } catch (e) {
    console.log("🚀 ~ deleteData ~ e:", e);
    throw new Error("No se pudo eliminar");
  }
};
export default {
  getAllData,
  // getAllDayData,
  getAllDataByCondominium,
  getAllDataByHousing,
  getData,
  insertData,
  updateData,
  deleteData,
};
