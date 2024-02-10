import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import reservationService from "../services/reservationService";
import { IReservation } from "../types/reserve/reserve";

//import { firebaseError } from "../data/firebaseError";

type QueryType = "reservationsQuery" | "reservationQuery";

type Props = {
  enabled?: boolean;
  id?: string;
  params?: {
    idcondominium: string;
    selectedDate?: Date;
  };
};

const defaultProps: Props = {
  params: {
    selectedDate: new Date(),
    idcondominium: "",
  },
};

type PropsCreate = {
  data: IReservation;
  file?: File[];
  requiredPayment: boolean;
};
type PropsUpdate = {
  data: Partial<IReservation>;
  file?: File[];
  requiredPayment: boolean;
};

export const useReserve = ({
  id = undefined,
  params,
}: Props = defaultProps) => {
  const client = useQueryClient();

  /*
  ! DEPRECATED: Get all data from reservations
    const reservationsQuery = useQuery({
      queryKey: ["reservations"],
      queryFn: () => reservationService.getAllData(),
      enabled: query.includes()
    }); */

  const reservationsQuery = useQuery({
    queryKey: ["reservations", params?.idcondominium],
    queryFn: () => reservationService.getAllData(params),
  });

  // const reservationQuery = useQuery({
  //   queryKey: ["reservations", id],
  //   queryFn: () => reservationService.getData(id || ""),
  //   enabled: !!id,
  // });

  // const reservationCreateMutation = useMutation({
  //   mutationFn: async (data: PropsCreate) => {
  //     const creacion = async () => {
  //       if (data.requiredPayment && !data.file?.length)
  //         throw new Error("No se ha subido un comprobante");

  //       if (data.requiredPayment && data.file?.length) {
  //         const id = await reservationService.insertData({
  //           ...data.data,
  //           idcondominium: params?.idcondominium || "",
  //         });
  //         const urlPayment = await onUploadFile(data.file[0], [id], "payments");
  //         await reservationService.updateData(
  //           {
  //             id,
  //             urlPayment,
  //             filename: data.file[0].name,
  //             idcondominium: params?.idcondominium || "",
  //           },
  //           true
  //         );
  //       } else {
  //         await reservationService.insertData({
  //           ...data.data,
  //           idcondominium: params?.idcondominium || "",
  //         });
  //       }
  //     };

  //     try {
  //       return await toast.promise(creacion(), {
  //         loading: "Creando reserva....",
  //         error: (e: any) =>
  //           firebaseError[e.message] ||
  //           e.message ||
  //           "Hubo un error al crear la reserva",
  //         success: "Reserva creada con éxito",
  //       });
  //     } catch (e: any) {
  //       throw new Error(
  //         firebaseError[e.message] ||
  //         e.message ||
  //         "Hubo un error al crear la reserva"
  //       );
  //     }
  //   },
  //   onSuccess: () => {
  //     client.invalidateQueries({
  //       queryKey: ["reservations"],
  //     });
  //   },
  //   onError: (e: any) => {
  //     console.log(e.message);
  //   },
  // });

  // const reservationUpdateMutation = useMutation({
  //   mutationFn: (data: Partial<PropsUpdate>) => {
  //     const creacion = async () => {
  //       if (!data.data) throw new Error("Informacion invalida");

  //       if (data.data && !data.data.id)
  //         throw new Error("Informacion invalida. No se encontrol el id");

  //       if (data.requiredPayment && !data.data.urlPayment && !data.file?.length)
  //         throw new Error("No se ha subido un comprobante");

  //       if (
  //         data.requiredPayment &&
  //         data.file?.length
  //       ) {
  //         const urlPayment = await onUploadFile(
  //           data.file[0],
  //           [data.data.id || ""],
  //           "payments"
  //         );
  //         await reservationService.updateData({
  //           ...data.data,
  //           urlPayment,
  //           filename: data.file[0].name,
  //           idcondominium: params?.idcondominium,
  //         });
  //       } else {
  //         await reservationService.updateData({
  //           ...data.data,
  //           idcondominium: params?.idcondominium,
  //         });
  //       }
  //     };

  //     return toast.promise(creacion(), {
  //       loading: "Actualizando reserva....",
  //       error: (e: any) =>
  //         e.message || "Hubo un error al actualizar la reserva",
  //       success: "Reserva actualizada con éxito",
  //     });
  //   },
  //   onSuccess: () => {
  //     client.invalidateQueries({
  //       queryKey: ["reservations"],
  //     });
  //   },
  //   onError: (error: any) => {
  //     console.log(error.message, "ERROR UPDATE");
  //     return error.message;
  //   },
  // });

  // const reservationDeleteMutation = useMutation({
  //   mutationFn: (id: string) => {
  //     return toast.promise(reservationService.deleteData(id), {
  //       loading: "Eliminando reserva....",
  //       error: "Hubo un error al eliminar la reserva",
  //       success: "Reserva eliminada con éxito",
  //     });
  //   },
  //   onSuccess: () => {
  //     client.invalidateQueries({
  //       queryKey: ["reservations"],
  //     });
  //   },
  //   onError: (error: any) => {
  //     console.log(error);
  //   },
  // });

  return {
    reservationsQuery,
    //reservationQuery,
    // reservationCreateMutation,
    // reservationUpdateMutation,
    // reservationDeleteMutation,
  };
};