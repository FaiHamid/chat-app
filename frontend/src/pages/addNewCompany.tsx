import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { ICompany } from "../types/Company";
import { ESnackbarStatus } from "../types/User";
import { useMutation, useQuery } from "@tanstack/react-query";
import { companiesService } from "../services/companiesService";
import { AxiosError } from "axios";
import { AutohideSnackbar } from "../utils/snackBar";
import { currentUserQuery } from "../reactQuery/userQuery";
import { CustomLoader } from "../components/customLoader";
import { useForm } from "react-hook-form";
import { UploadLogoToNewCompany } from "../components/uploadLogoToNewCompany";

export const NewCompany: React.FC = () => {
  const { data: currentUser, isLoading } = useQuery(currentUserQuery);
  const [address, setAddress] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarDetails, setSnackbarDetails] = useState({
    message: "",
    status: ESnackbarStatus.Success,
  });

  const [autocomplete, setAutocomplete] =
    // eslint-disable-next-line no-undef
    useState<google.maps.places.Autocomplete | null>(null);

  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm<Omit<ICompany, "idUser">>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      service: "",
      logotype: "",
      capital: 0,
      price: 0,
    },
  });

  const [companyData, setCompanyData] = useState({
    latitude: "",
    longitude: "",
  });

  const GOOGLE_API_KEY = import.meta.env.VITE_API_KEY;

  const handleAddressChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setAddress(value);

    if (autocomplete) {
      autocomplete.set("place", null);
    }
  };

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setCompanyData({
          latitude: lat.toString(),
          longitude: lng.toString(),
        });
        setAddress(place.formatted_address || "");
      }
    }
  };

  const mutation = useMutation<void, Error, Omit<ICompany, "idUser">>({
    mutationFn: async (data) => {
      if (currentUser) {
        await companiesService.addNewCompany({
          ...data,
          ...companyData,
          idUser: currentUser?.id,
        });
      }

      return;
    },
    onSuccess: () => {},
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  const handleAddCompany = async (data: Omit<ICompany, "idUser">) => {
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await mutation.mutateAsync(data);
      setSnackbarDetails({
        message: "Success add company",
        status: ESnackbarStatus.Success,
      });
      setSnackbarOpen(true);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        setSnackbarDetails({
          message: errorMessage,
          status: ESnackbarStatus.Error,
        });
        setSnackbarOpen(true);
      }
    }
  };

  if (isLoading) {
    return <CustomLoader loaderSize={30} paddingY={50} />;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleAddCompany)}
        className="rounded-md grid grid-cols-2 grid-rows-[auto,1fr,auto] gap-4 bg-slate-800 p-10 border border-slate-600 mb-5 shadow-md mx-5"
      >
        <p className="text-[36px] font-semibold mb-3 col-span-2 row-start-1">
          Add new company:
        </p>
        <div className="col-span-1 row-start-2">
          <div className="flex items-center mb-10 relative">
            <UploadLogoToNewCompany
              previewURL={previewURL}
              selectedFile={selectedFile}
              onChangePreviewURL={setPreviewURL}
              onChangeSelectedFile={setSelectedFile}
            />
          </div>
          <div className="max-w-[400px]">
            <p className="mb-3 font-semibold">Name:</p>
            <TextField
              required
              id="outlined-basic"
              variant="outlined"
              placeholder="Enter company name"
              {...register("name", {
                required: "Company name is required",
              })}
              sx={{ mb: "25px", width: "100%" }}
            />

            <p className="mb-3 font-semibold">Service:</p>
            <TextField
              required
              id="outlined-basic"
              variant="outlined"
              placeholder="Enter company service"
              {...register("service", {
                required: "Service is required",
              })}
              sx={{ mb: "35px", width: "100%" }}
            />
          </div>
        </div>

        <div className="max-w-[400px] col-span-1 row-start-2 mt-[55px]">
          <p className="mb-3 font-semibold">Capital:</p>
          <TextField
            required
            id="outlined-basic"
            variant="outlined"
            {...register("capital", {
              required: "Capital is required",
              pattern: /^\d*$/
            })}
            sx={{ mb: "35px", width: "100%" }}
          />

          <p className="mb-3 font-semibold">Price:</p>
          <TextField
            required
            id="outlined-basic"
            variant="outlined"
            {...register("price", {
              required: "Price is required",
              pattern: /^\d*$/
            })}
            sx={{ mb: "35px", width: "100%" }}
          />

          <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={["places"]}>
            <Autocomplete
              onLoad={(autocomplete) => setAutocomplete(autocomplete)}
              onPlaceChanged={handlePlaceSelect}
            >
              <>
                <p className="mb-3 font-semibold">Address:</p>
                <TextField
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Enter address"
                  sx={{ mb: "35px", width: "100%" }}
                />
              </>
            </Autocomplete>
          </LoadScript>
        </div>
        <Button
          variant="contained"
          sx={{ marginBlock: "20px", maxWidth: "200px" }}
          type="submit"
          className="col-span-1 row-start-3"
        >
          Save
        </Button>
      </form>

      <AutohideSnackbar
        message={snackbarDetails.message}
        isOpen={snackbarOpen}
        onClose={setSnackbarOpen}
        status={snackbarDetails.status}
      />
    </>
  );
};
