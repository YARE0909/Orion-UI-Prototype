/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Toast from "@/components/ui/Toast";
import { Location, User } from "@/utils/types";
import { Plus } from "lucide-react";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Locations({ locationData, fetchLocationData, fetchLocationGroupData }: {
  locationData: Location[];
  fetchLocationData: () => void;
  fetchLocationGroupData: () => void;
}) {
  const [filteredLocationData, setFilteredLocationData] = useState<Location[]>([]);
  const [createLocationModal, setCreateLocationModal] = useState<boolean>(false);
  const [editLocationModal, setEditLocationModal] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Location>({
    LocationName: '',
    LocationCode: '',
    LocationType: '',
    LocationManager: null,
    LocationParentID: 0,
    LocationImage: '',
    LocationLogo: '',
    LocationReceptionistPhoto: '',
    LocationAdvertisementVideo: '',
    IsActive: 0,
  });
  const [createLocationFormData, setCreateLocationFormData] = useState<Location>({
    LocationName: '',
    LocationCode: '',
    LocationType: '',
    LocationManager: null,
    LocationParentID: 0,
    LocationImage: '',
    LocationLogo: '',
    LocationReceptionistPhoto: '',
    LocationAdvertisementVideo: '',
    IsActive: 0,
  });
  const [userListData, setUserListData] = useState<User[]>([]);


  const handleCreateLocationChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCreateLocationFormData({
      ...createLocationFormData,
      [event.target.name]: event.target.value
    });
  }

  const handleEditLocationChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (selectedLocation) {
      setSelectedLocation({
        ...selectedLocation,
        [event.target.name]: event.target.value || ''
      });
    }
  }

  const handleOpenCreateLocationModal = () => {
    setCreateLocationModal(true);
  }

  const handleCloseCreateLocationModal = () => {
    setCreateLocationModal(false);
  }

  const handleOpenEditLocationModal = (location: Location) => {
    setSelectedLocation(location);
    setEditLocationModal(true);
  }

  const handleCloseEditLocationModal = () => {
    setSelectedLocation({
      LocationName: '',
      LocationCode: '',
      LocationType: '',
      LocationManager: null,
      LocationParentID: 0,
      LocationImage: null,
      LocationLogo: null,
      LocationReceptionistPhoto: null,
      LocationAdvertisementVideo: '',
      IsActive: 0,
    });
    setEditLocationModal(false);
  }

  const handleCreateLocationSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const cookies = parseCookies();
      const { userToken } = cookies;

      console.log({ createLocationFormData });

      const formData = new FormData();
      // Append all the other form fields

      if (createLocationFormData?.LocationName.length > 100) {
        return toast.custom((t: any) => (
          <Toast type='warning' content='Location Name Too Long' t={t} />
        ))
      }

      if (createLocationFormData?.LocationCode.length > 10) {
        return toast.custom((t: any) => (
          <Toast type='warning' content='Location Code Too Long' t={t} />
        ))
      }

      if (createLocationFormData?.LocationManager === null) {
        return toast.custom((t: any) => (
          <Toast type='warning' content='Select a location manager' t={t} />
        ))
      }

      if (createLocationFormData?.LocationType === "Property" && createLocationFormData?.LocationParentID === 0) {
        return toast.custom((t: any) => (
          <Toast type='warning' content='Select a control location for property' t={t} />
        ))
      }

      Object.keys(createLocationFormData!).forEach((key) => {
        const value = createLocationFormData![key as keyof Location];
        if (
          key !== "LocationImage" &&
          key !== "LocationLogo" &&
          key !== "LocationReceptionistPhoto"
        ) {
          formData.append(key, value);
        }
      });

      // Append the UserPhoto as a file
      if (createLocationFormData.LocationLogo) {
        formData.append('LocationLogo', createLocationFormData.LocationLogo);
      }

      if (createLocationFormData.LocationImage) {
        formData.append('LocationImage', createLocationFormData.LocationImage);
      }

      if (createLocationFormData.LocationReceptionistPhoto) {
        formData.append('LocationReceptionistPhoto', createLocationFormData.LocationReceptionistPhoto);
      }

      console.log({ createLocationFormData });

      console.log("FormData content:", Array.from(formData.entries()));

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/location`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        body: formData
      });

      if (response.status === 201) {
        toast.custom((t: any) => (
          <Toast type='success' content='Location Created successfully' t={t} />
        ))
        setCreateLocationModal(false);
        fetchLocationData();
        fetchLocationGroupData();
        setCreateLocationFormData({
          LocationName: '',
          LocationCode: '',
          LocationType: '',
          LocationManager: null,
          LocationParentID: 0,
          LocationImage: null,
          LocationLogo: null,
          LocationReceptionistPhoto: null,
          LocationAdvertisementVideo: '',
          IsActive: 0,
        });
      } else {
        throw new Error('Failed to create location');
      }

    } catch {
      return toast.custom((t: any) => (
        <Toast type='error' content='Failed to create location' t={t} />
      ))
    }
  }

  const handleEditLocationSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Ensure LocationParentID is set to 0 for 'Control' type
    if (selectedLocation?.LocationType === "Control") {
      selectedLocation.LocationParentID = 0;
    }

    if (selectedLocation?.LocationName.length > 100) {
      return toast.custom((t: any) => (
        <Toast type='warning' content='Location Name Too Long' t={t} />
      ))
    }

    if (selectedLocation?.LocationCode.length > 10) {
      return toast.custom((t: any) => (
        <Toast type='warning' content='Location Code Too Long' t={t} />
      ))
    }

    if (selectedLocation?.LocationManager === null) {
      return toast.custom((t: any) => (
        <Toast type='warning' content='Select a location manager' t={t} />
      ))
    }

    if (selectedLocation?.LocationType === "Property" && selectedLocation?.LocationParentID === 0) {
      return toast.custom((t: any) => (
        <Toast type='warning' content='Select a control location for property' t={t} />
      ))
    }

    try {
      const cookies = parseCookies();
      const { userToken } = cookies;

      const formData = new FormData();

      // Append non-file fields to FormData
      Object.keys(selectedLocation!).forEach((key) => {
        const value = selectedLocation![key as keyof Location];
        if (
          key !== "LocationImage" &&
          key !== "LocationLogo" &&
          key !== "LocationReceptionistPhoto"
        ) {
          formData.append(key, value);
        }
      });

      // Append file fields to FormData
      if (selectedLocation!.LocationImage) {
        formData.append("LocationImage", selectedLocation!.LocationImage);
      }

      if (selectedLocation!.LocationLogo) {
        formData.append("LocationLogo", selectedLocation!.LocationLogo);
      }

      if (selectedLocation!.LocationReceptionistPhoto) {
        formData.append(
          "LocationReceptionistPhoto",
          selectedLocation!.LocationReceptionistPhoto
        );
      }

      console.log({ selectedLocation });

      console.log("FormData content:", Array.from(formData.entries()));

      // Send API request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/location`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userToken}`, // No 'Content-Type', as FormData sets it
          },
          body: formData,
        }
      );

      if (response.status === 200) {
        toast.custom((t: any) => (
          <Toast type="success" content="Location updated successfully" t={t} />
        ));
        setEditLocationModal(false);
        fetchLocationData();
        fetchLocationGroupData();
        setSelectedLocation({
          LocationName: "",
          LocationCode: "",
          LocationType: "",
          LocationManager: null,
          LocationParentID: 0,
          LocationImage: null,
          LocationLogo: null,
          LocationReceptionistPhoto: null,
          LocationAdvertisementVideo: '',
          IsActive: 0,
        });
      } else {
        throw new Error("Failed to update location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      toast.custom((t: any) => (
        <Toast type="error" content="Failed to update location" t={t} />
      ));
    }
  };

  const fetchUserListData = async () => {
    try {
      const cookies = parseCookies();
      const { userToken } = cookies;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });
      if (response.status === 200) {
        const data: User[] = await response.json();
        setUserListData(
          data.filter((user) => user.IsActive === 1 && user.Role !== "Guest")
        );
      } else {
        throw new Error('Failed to fetch location data');
      }
    } catch {
      return toast.custom((t: any) => (
        <Toast type='error' content='Failed to fetch location data' t={t} />
      ))
    }
  }


  const handleSearchLocation = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchValue = event.target.value;
    const filteredLocations = locationData.filter(location => location.LocationName.toLowerCase().includes(searchValue.toLowerCase()));
    setFilteredLocationData(filteredLocations);
  }

  useEffect(() => {
    setFilteredLocationData(locationData);
  }, [locationData])

  useEffect(() => {
    fetchUserListData();
  }, [])

  return (
    <div className='w-1/2 h-full overflow-y-auto border-r border-r-border flex flex-col relative'>
      <div className='flex items-center justify-between sticky top-0 bg-background pb-2 pr-2 border-b border-b-border'>
        <div className="flex items-center gap-1">
          <SearchInput placeholder='Locations' onChange={handleSearchLocation} />
        </div>
        <div>
          <Button color='foreground' icon={<Plus />} text='Location' onClick={handleOpenCreateLocationModal} />
        </div>
      </div>
      <div className='w-full h-full pt-2 pb-2 pr-2'>
        {/* Create a grid to display locationOptions in cards */}
        <div className="w-full h-fit grid grid-cols-3 gap-2">
          {
            filteredLocationData?.map((location, index) => (
              <div key={index} className='w-full h-full rounded-md bg-foreground border border-border hover:bg-highlight duration-300 p-2 cursor-pointer' onClick={handleOpenEditLocationModal.bind(null, location)}>
                <div className="w-full">
                  <div>
                    <h1 className='font-bold text-xl'>{location?.LocationName}</h1>
                  </div>
                  <div className='w-full h-full flex flex-col gap-1 justify-between items-start'>
                    <div className='w-full h-full'>
                      <div className='w-full h-full flex flex-col gap-1'>
                        <div className="w-full flex justify-center items-center">
                          <div className='w-full flex gap-1 items-center'>
                            <h1 className='font-bold text-sm text-textAlt'>Type</h1>
                            <h1 className='font-bold text-sm text-text'>
                              {location?.LocationType}
                            </h1>
                          </div>
                          <div>
                            {
                              location?.IsActive ? (
                                <span
                                  className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/30 text-green-500"
                                >
                                  Active
                                </span>
                              ) : (
                                <span
                                  className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/30 text-red-500"
                                >
                                  Inactive
                                </span>
                              )
                            }
                          </div>
                        </div>
                        {
                          location.LocationParentID !== 0 &&
                          (
                            <div className='w-full flex gap-1 items-center'>
                              <h1 className='font-bold text-sm text-textAlt'>Control</h1>
                              <h1 className='font-bold text-sm text-text'>
                                {
                                  locationData.find(loc => loc.LocationID === location?.LocationParentID)?.LocationName}
                              </h1>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Create Location Modal */}
      {
        createLocationModal && (
          <Modal className="w-1/2" title='New Location' onClose={handleCloseCreateLocationModal}>
            <form className="mt-4 w-full h-full" onSubmit={handleCreateLocationSubmit}>
              <div className='w-full h-full flex flex-col gap-4 justify-between'>
                <div className='w-full flex justify-between gap-2'>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Name
                    </h1>
                    <Input
                      name='LocationName'
                      value={createLocationFormData.LocationName}
                      onChange={handleCreateLocationChange}
                      required
                    />
                  </div>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Code
                    </h1>
                    <Input
                      name='LocationCode'
                      value={createLocationFormData.LocationCode}
                      onChange={handleCreateLocationChange}
                      required
                    />
                  </div>
                </div>
                <div className='w-full flex justify-between gap-2'>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Type
                    </h1>
                    <Select
                      options={
                        [
                          { value: 'Property', label: 'Property' },
                          { value: 'Control', label: 'Control' },
                        ]
                      }
                      placeholder='Select Location Type'
                      onChange={(e) => setCreateLocationFormData({ ...createLocationFormData, LocationType: e.target.value })}
                    />
                  </div>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Location Manager
                    </h1>
                    <Select
                      options={
                        userListData?.map(user => {
                          return { value: user.UserName, label: user.DisplayName }
                        })
                      }
                      placeholder='Select Location Type'
                      onChange={(e) => setCreateLocationFormData({ ...createLocationFormData, LocationManager: e.target.value })}
                    />
                  </div>
                </div>
                <div className='w-full flex justify-between gap-2'>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Logo
                    </h1>
                    <Input
                      name='LocationLogo'
                      // value={createLocationFormData.LocationLogo}
                      onChange={handleCreateLocationChange}
                      type="file"
                    // required
                    />
                  </div>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Receptionist Photo
                    </h1>
                    <Input
                      name='LocationReceptionistPhoto'
                      // value={createLocationFormData.LocationReceptionistPhoto}
                      onChange={handleCreateLocationChange}
                      type="file"
                    // required
                    />
                  </div>
                </div>
                <div className='w-full flex justify-between gap-2'>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Video Feed
                    </h1>
                    <Input
                      name='LocationVideoFeed'
                      value={createLocationFormData.LocationVideoFeed}
                      onChange={handleCreateLocationChange}
                    />
                  </div>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Advertisement Video
                    </h1>
                    <Input
                      name='LocationAdvertisementVideo'
                      value={createLocationFormData.LocationAdvertisementVideo}
                      onChange={handleCreateLocationChange}
                    />
                  </div>
                </div>
                <div className="w-full flex justify-between gap-2">
                  <div className='w-full max-w-[50%]'>
                    <h1 className='font-bold text-sm'>
                      Image
                    </h1>
                    <Input
                      name='LocationImage'
                      // value={createLocationFormData.LocationImage}
                      onChange={handleCreateLocationChange}
                      type="file"
                    // required
                    />
                  </div>
                  {createLocationFormData.LocationType === "Property" &&
                    (<div className='w-full'>
                      <h1 className='font-bold text-sm'>
                        Control
                      </h1>
                      <Select
                        options={
                          locationData.filter(location => location.LocationType === "Control").map(location => ({ value: location.LocationID!.toString(), label: location.LocationName }))
                        }
                        placeholder='Assign Control'
                        onChange={(e) => setCreateLocationFormData({ ...createLocationFormData, LocationParentID: Number(e.target.value) })}
                      />
                    </div>)}
                </div>
                <div className="w-full flex justify-between">
                  <div className='w-full flex items-center gap-2'>
                    <Input
                      type='checkBox'
                      name='IsActive'
                      value={createLocationFormData!.IsActive === 1 ? 'true' : 'false'}
                      onChange={(e) => setCreateLocationFormData({ ...createLocationFormData, IsActive: (e.target as HTMLInputElement).checked ? 1 : 0 })}
                    />
                    <h1 className='font-bold text-sm'>
                      {
                        createLocationFormData!.IsActive ? 'Active' : 'Inactive'
                      }
                    </h1>
                  </div>
                  {/* <div>
                    <Button text='Preview' color='foreground' onClick={handleCloseCreateLocationModal} />
                  </div> */}
                </div>
                <div className='flex justify-center gap-2 border-t-2 border-t-border pt-4'>
                  <Button text='Save' color='foreground' type='submit' />
                  <Button text='Cancel' color='foreground' onClick={handleCloseCreateLocationModal} />
                </div>
              </div>
            </form>
          </Modal>
        )
      }

      {/* Edit Location Modal */}
      {
        editLocationModal && (
          <Modal className="w-1/2" title='Edit Location' onClose={handleCloseEditLocationModal}>
            <form className="mt-4" onSubmit={handleEditLocationSubmit}>
              <div className='flex flex-col gap-2'>
                <div className='w-full flex justify-between gap-2'>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Name
                    </h1>
                    <Input
                      name='LocationName'
                      value={selectedLocation!.LocationName}
                      onChange={handleEditLocationChange}
                      required
                    />
                  </div>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Code
                    </h1>
                    <Input
                      name='LocationCode'
                      value={selectedLocation!.LocationCode}
                      onChange={handleEditLocationChange}
                      required
                    />
                  </div>
                </div>
                <div className='w-full flex justify-between gap-2'>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Type
                    </h1>
                    <Select
                      options={
                        [
                          { value: 'Property', label: 'Property' },
                          { value: 'Control', label: 'Control' },
                        ]
                      }
                      placeholder='Select Location Type'
                      onChange={(e) => setSelectedLocation({ ...selectedLocation!, LocationType: e.target.value })}
                      defaultValue={selectedLocation!.LocationType}
                    />
                  </div>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Location Manager
                    </h1>
                    <Select
                      options={
                        userListData?.map(user => {
                          return { value: user.UserName, label: user.DisplayName }
                        })
                      }
                      placeholder='Select Location Type'
                      onChange={(e) => setSelectedLocation({ ...selectedLocation, LocationManager: e.target.value })}
                      defaultValue={selectedLocation?.LocationManager ?? undefined}
                    />
                  </div>
                </div>
                <div className='w-full flex justify-between gap-2'>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Logo
                    </h1>
                    <Input
                      name='LocationLogo'
                      value={selectedLocation!.LocationLogo}
                      onChange={handleEditLocationChange}
                      type="file"
                    // required
                    />
                  </div>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Receptionist Photo
                    </h1>
                    <Input
                      name='LocationReceptionistPhoto'
                      value={selectedLocation!.LocationReceptionistPhoto}
                      onChange={handleEditLocationChange}
                      type="file"
                    // required
                    />
                  </div>
                </div>
                <div className='w-full flex justify-between gap-2'>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Video Feed
                    </h1>
                    <Input
                      name='LocationVideoFeed'
                      value={selectedLocation.LocationVideoFeed}
                      onChange={handleEditLocationChange}
                    />
                  </div>
                  <div className='w-full'>
                    <h1 className='font-bold text-sm'>
                      Advertisement Video
                    </h1>
                    <Input
                      name='LocationAdvertisementVideo'
                      value={selectedLocation.LocationAdvertisementVideo}
                      onChange={handleEditLocationChange}
                    />
                  </div>
                </div>
                <div className='w-full flex justify-between gap-2'>
                  <div className='w-full max-w-[50%]'>
                    <h1 className='font-bold text-sm'>
                      Image
                    </h1>
                    <Input
                      name='LocationImage'
                      value={selectedLocation!.LocationImage}
                      onChange={handleEditLocationChange}
                      type="file"
                    // required
                    />
                  </div>
                  {selectedLocation!.LocationType === "Property" &&
                    (<div className='w-full'>
                      <h1 className='font-bold text-sm'>
                        Control
                      </h1>
                      <Select
                        options={
                          locationData.filter(location => location.LocationType === "Control").map(location => ({ value: location.LocationID!.toString(), label: location.LocationName }))
                        }
                        placeholder='Assign Control'
                        onChange={(e) => setSelectedLocation({ ...selectedLocation!, LocationParentID: Number(e.target.value) })}
                        defaultValue={selectedLocation?.LocationParentID!.toString()}
                      />
                    </div>)}
                </div>
                <div className="w-full flex justify-between pb-2">
                  <div className='w-full flex gap-2 items-center'>
                    <Input
                      type='checkBox'
                      name='IsActive'
                      value={selectedLocation!.IsActive === 1 ? 'true' : 'false'}
                      onChange={(e) => setSelectedLocation({ ...selectedLocation!, IsActive: (e.target as HTMLInputElement).checked ? 1 : 0 })}
                      required
                    />
                    <h1 className='font-bold text-sm'>
                      {
                        selectedLocation!.IsActive ? 'Active' : 'Inactive'
                      }
                    </h1>
                  </div>
                  {/* <div>
                    <Button text='Preview' color='foreground' onClick={handleCloseCreateLocationModal} />
                  </div> */}
                </div>
                <div className="w-full flex justify-between gap-2">
                  {
                    selectedLocation!.LocationImage && (
                      <div className="w-1/3 flex justify-center">
                        <div className="w-full flex flex-col gap-2">
                          <div>
                            <h1 className="font-bold text-sm">
                              Location Image
                            </h1>
                          </div>
                          <div className="w-full flex justify-center">
                            <img
                              src={
                                selectedLocation!.LocationImage instanceof File ?
                                  URL.createObjectURL(selectedLocation!.LocationImage) :
                                  `${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedLocation!.LocationImage}`
                              }
                              alt="Location Image"
                              className="w-20 h-20 object-contain rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  }
                  {
                    selectedLocation!.LocationLogo && (
                      <div className="w-1/3 flex justify-center">
                        <div className="w-full flex flex-col gap-2">
                          <div>
                            <h1 className="font-bold text-sm">
                              Location Logo
                            </h1>
                          </div>
                          <div className="w-full flex justify-center">
                            <img
                              src={
                                selectedLocation!.LocationLogo instanceof File ?
                                  URL.createObjectURL(selectedLocation!.LocationLogo) :
                                  `${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedLocation!.LocationLogo}`}
                              alt="Location Logo"
                              className="w-20 h-20 object-contain rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  }
                  {
                    selectedLocation!.LocationReceptionistPhoto && (
                      <div className="w-1/3 flex justify-center">
                        <div className="w-full flex flex-col gap-2">
                          <div>
                            <h1 className="font-bold text-sm">
                              Receptionist Photo
                            </h1>
                          </div>
                          <div className="w-full flex justify-center">
                            <img
                              src={
                                selectedLocation!.LocationReceptionistPhoto instanceof File ?
                                  URL.createObjectURL(selectedLocation!.LocationReceptionistPhoto) :
                                  `${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedLocation!.LocationReceptionistPhoto}`}
                              alt="Receptionist Photo"
                              className="w-20 h-20 object-contain rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  }
                </div>
                <div className='flex justify-center gap-2 border-t-2 border-t-border pt-4'>
                  <Button text='Save' color='foreground' type='submit' />
                  <Button text='Cancel' color='foreground' onClick={handleCloseEditLocationModal} />
                </div>
              </div>
            </form>
          </Modal>
        )
      }
    </div>
  )
}