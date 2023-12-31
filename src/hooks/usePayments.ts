import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import storageService, { TFile } from "@/services/storageService";
import { IPayments } from "@/types/payments/payments";
import paymentService from "@/services/paymentService";

type QueryType = "announcementsQuery" | "announcementQuery";

type HookProps = {
  id?: string;
  params: {
    idcharge: string;
    iduser: string;
    //idhousing: string;
    // q?: string;
    // limitResults?: number;
  };
  query?: QueryType[];
};

type PropsCreate = {
  data: IPayments;
  file?: TFile;
};
// type PropsUpdate = {
//   data: Partial<IAnnouncement>;
//   file?: File[];
// };

export const usePayments = (props: HookProps) => {
  const client = useQueryClient();

  if (!props?.id && !props?.params) {
    throw new Error("Id or idcondominium is missing");
  }

  const { params, id = undefined, query } = props;

  // const paymentsQuery = useQuery({
  //   queryKey: ["paymentTypes", params],
  //   queryFn: () =>
  //     paymentsService.getAllData({
  //       ...params,
  //       idcondominium: params?.idcondominium || "",
  //     }),
  // });

  const paymentQuery = useQuery({
    queryKey: ["payment", params.idcharge, params.iduser],
    queryFn: () =>
      paymentService.getDataAnnouncement(
        params.idcharge || "",
        params.iduser || ""
      ),
    enabled: !!params.idcharge && !!params.iduser,
  });

  const paymentCreateMutation = useMutation({
    mutationFn: (data: PropsCreate) => {
      console.log(data);
      const creation = async () => {
        if (data.file?.uri) {
          const urlimg = await storageService.onUploadFile(
            data.file,
            [data.file.name],
            "images"
          );
          await paymentService.insertData({
            ...data.data,
            urlimg,
          });
        } else {
          await paymentService.insertData({
            ...data.data,
            urlimg: "",
          });
        }
      };

      return creation();
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["payments"],
      });
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  // const incidentUpdateMutation = useMutation({
  //   mutationFn: (data: PropsCreate) => {
  //     const update = async () => {
  //       if (data.file?.uri) {
  //         const urlimg = await storageService.onUploadFile(
  //           data.file,
  //           [data.file.name],
  //           "images"
  //         );
  //         await incidentService.updateData({ ...data.data, urlimg });
  //       } else {
  //         await incidentService.updateData(data.data);
  //       }
  //     };

  //     return update();
  //   },
  //   onSuccess: () => {
  //     Toast.show({
  //       type: "success",
  //       text1: "Exito",
  //       text2: "Se ha registrado con exito",
  //     });
  //     client.invalidateQueries({
  //       queryKey: ["incidents"],
  //     });
  //   },
  //   onError: (error: any) => {
  //     Toast.show({
  //       type: "error",
  //       text1: "Error",
  //       text2: "Hubo un error",
  //     });
  //     console.log(error);
  //   },
  // });

  // const paymentTypesDeleteMutation = useMutation({
  //   mutationFn: (id: string) => {
  //     return toast.promise(paymentTypesService.deleteData(id), {
  //       loading: "Eliminando registro....",
  //       error: "Hubo un error al eliminar",
  //       success: "Eliminado con exito",
  //     });
  //   },
  //   onSuccess: () => {
  //     client.invalidateQueries({
  //       queryKey: ["paymentTypes"],
  //     });
  //   },
  //   onError: (error: any) => {
  //     console.log(error);
  //   },
  // });

  return {
    paymentQuery,
    paymentCreateMutation,
  };
};
