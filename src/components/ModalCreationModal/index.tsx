import { Dialog } from "@headlessui/react";
import { FC } from "react";
import { RxCross2 } from "react-icons/rx";
import { WayPointCoordinatesList } from "../WayPointCoordinatesList";

interface MissionCreationModalProps {
    open: boolean;
    onClose: (state: boolean) => void;
    coordinates: any;
    setDropdownIndex: (idx: number) => void;
    dropdownIndex: number | null;
    handleDropdownAction: (action: "before" | "after", index: number) => void;
    handleGenerateData: () => void;
}

export const MissionCreationModal: FC<MissionCreationModalProps> = ({
    open,
    onClose,
    coordinates,
    setDropdownIndex,
    dropdownIndex,
    handleDropdownAction,
    handleGenerateData
}) => {

    return (
        <>
            <Dialog open={open} onClose={() => onClose(false)} as="div">
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-3 relative">
                        <button
                            onClick={() => onClose(false)}
                            className="absolute top-3 right-4 text-gray-300 hover:text-gray-900"
                        >
                            <RxCross2 size={28} />
                        </button>

                        <h2 className="text-lg font-bold text-gray-800">
                            Mission Creation
                        </h2>

                        <hr className="my-4 -mx-3 border-gray-100 border-4" />

                        {coordinates.length ? (
                            <WayPointCoordinatesList
                                coordinates={coordinates}
                                setDropdownIndex={setDropdownIndex}
                                dropdownIndex={dropdownIndex}
                                handleDropdownAction={handleDropdownAction}
                            />
                        ) : (
                            <h3 className="text-lg font-bold text-gray-800">
                                Waypoint Navigation
                            </h3>
                        )}

                        {coordinates.length < 4 && (
                            <div className="border-2 border-dotted border-gray-400 bg-gray-200 text-gray-600 text-sm p-4 my-3 rounded">
                                Click on the map to mark points of the route and
                                then press ↵ to complete the route.
                            </div>
                        )}
                        <hr className="my-4 -mx-3 border-gray-300 shadow-sm" />

                        <div className="flex justify-end">
                            <button
                                onClick={handleGenerateData}
                                className="bg-indigo-500 text-white px-4 py-2 rounded shadow"
                            >
                                Generate Data
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};