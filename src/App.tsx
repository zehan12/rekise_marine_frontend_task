import { useRef, useEffect, useState, FC } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { Draw } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { MapComponent, MissionCreationModal, PolygonToolModal } from "./components";
import { Coordinate } from "./types";

type AppProps = {};

const App: FC<AppProps> = () => {
    const mapElement = useRef<HTMLDivElement | null>(null);
    const [isFirstClick, setIsFirstClick] = useState(true);
    const [map, setMap] = useState<Map | null>(null);
    const [vectorSource] = useState<VectorSource>(
        new VectorSource()
    );
    const [_isDrawing, setIsDrawing] = useState(false);
    const [lineStringModalOpen, setLineStringModalOpen] = useState(false);
    const [polygonModalOpen, setPolygonModalOpen] = useState(false);
    const [lineStringCoordinates, setLineStringCoordinates] = useState<
        Coordinate[]
    >([]);
    const [polygonCoordinates, setPolygonCoordinates] = useState<Coordinate[]>(
        []
    );
    const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);


    useEffect(() => {
        if (!mapElement.current) return;

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        const mapInstance = new Map({
            target: mapElement.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer,
            ],
            view: new View({
                center: [0, 0],
                zoom: 3,
            }),
        }) as null | any;

        setMap(mapInstance);
        return () => mapInstance.setTarget(null);
    }, [vectorSource]);

    const startDrawing = (
        type: "LineString" | "Polygon",
        _insertIndex: number | null = null
    ) => {
        if (!map) return;

        setIsDrawing(true);
        const draw = new Draw({
            source: vectorSource,
            type,
        });

        map.addInteraction(draw);

        draw.on("drawend", (event) => {
            const geometry = event.feature.getGeometry() as any;
            if (!geometry) return;

            const newCoordinates = geometry.getCoordinates() as Coordinate[];
            if (type === "LineString") {
                setLineStringCoordinates((prev) => [
                    ...prev,
                    ...newCoordinates,
                ]);
                setLineStringModalOpen(true);
            } else if (type === "Polygon") {
                setPolygonCoordinates(newCoordinates);
                setPolygonModalOpen(true);
            }
            setIsDrawing(false);
            map.removeInteraction(draw);
        });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                draw.finishDrawing();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            map.removeInteraction(draw);
        };
    };


    const handleImportPolygon = () => {
        if (!polygonCoordinates.length || dropdownIndex === null) {
            console.error("No polygon data or dropdown index specified.");
            return;
        }

        setLineStringCoordinates((prev) => {
            const updated = [...prev];
            updated.splice(dropdownIndex, 0, ...polygonCoordinates);
            return updated;
        });

        console.log("Polygon imported into LineString.");
        setPolygonModalOpen(false);
        setDropdownIndex(null);
    };

    const handleGenerateData = () => {
        alert(lineStringCoordinates)
    }


    const handleDropdownAction = (
        action: "before" | "after",
        index: number
    ) => {
        setLineStringModalOpen(false);
        setPolygonModalOpen(true);
        const insertIndex = action === "before" ? index : index + 1;
        setDropdownIndex(insertIndex);
        startDrawing("Polygon", insertIndex);
    };

    const handleDrawingClick = () => {
        setIsFirstClick(false);
        if (isFirstClick) {
            setLineStringModalOpen(true);
        }
        startDrawing("LineString");
    };

    const handleMissionModalOpen = () => {
        setLineStringModalOpen(true);
    };

    const handlePolygonModalClose = () => {
        setPolygonModalOpen(false);
    };

    const handlePolygonModalBackButton = () => {
        setPolygonModalOpen(false)
        setLineStringModalOpen(true)
    }


    return (
        <div className="h-screen flex flex-col">
            <MapComponent
                ref={mapElement}
                isFirstClick={isFirstClick}
                handleModalOpen={handleMissionModalOpen}
                handleDrawingClick={handleDrawingClick}
            />
            <MissionCreationModal
                open={lineStringModalOpen}
                onClose={setLineStringModalOpen}
                coordinates={lineStringCoordinates}
                setDropdownIndex={setDropdownIndex}
                dropdownIndex={dropdownIndex}
                handleDropdownAction={handleDropdownAction}
                handleGenerateData={handleGenerateData}
            />
            <PolygonToolModal
                open={polygonModalOpen}
                onClose={handlePolygonModalClose}
                coordinates={polygonCoordinates}
                handleImportPolygon={handleImportPolygon}
                handlePolygonModalBackButton={handlePolygonModalBackButton}
            />
        </div>
    );
};

export default App;