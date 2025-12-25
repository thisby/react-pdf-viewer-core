declare module "types/LocalizationMap" {
    export interface LocalizationMap {
        [key: string]: string | LocalizationMap;
    }
}
declare module "localization/LocalizationContext" {
    import * as React from 'react';
    import { type LocalizationMap } from "types/LocalizationMap";
    export interface LocalizationContextProps {
        l10n: LocalizationMap;
        setL10n(l10n: LocalizationMap): void;
    }
    export const DefaultLocalization: LocalizationMap;
    export const LocalizationContext: React.Context<LocalizationContextProps>;
}
declare module "theme/ThemeContext" {
    import * as React from 'react';
    export enum TextDirection {
        RightToLeft = "RTL",
        LeftToRight = "LTR"
    }
    export interface ThemeContextProps {
        currentTheme: string;
        direction?: TextDirection;
        setCurrentTheme: (theme: string) => void;
    }
    export const ThemeContext: React.Context<ThemeContextProps>;
}
declare module "utils/isDarkMode" {
    export const isDarkMode: () => boolean;
}
declare module "types/Theme" {
    export interface Theme {
        name: string;
        variables: {
            border: string;
            radius: string;
            ring: string;
            background: string;
            foreground: string;
            muted: string;
            mutedForeground: string;
            primary: string;
            primaryForeground: string;
            secondary: string;
            secondaryForeground: string;
            accent: string;
            accentForeground: string;
            destructive: string;
            destructiveForeground: string;
            highlight: string;
        };
    }
}
declare module "theme/darkTheme" {
    import { type Theme } from "types/Theme";
    export const DARK_THEME: Theme;
}
declare module "theme/lightTheme" {
    import { type Theme } from "types/Theme";
    export const LIGHT_THEME: Theme;
}
declare module "theme/useTheme" {
    import { type Theme } from "types/Theme";
    export const useTheme: (theme: Theme) => void;
}
declare module "theme/withTheme" {
    export const withTheme: (theme: string) => [string, (theme: string) => void];
}
declare module "structs/PageMode" {
    export enum PageMode {
        Attachments = "UseAttachments",
        Bookmarks = "UseOutlines",
        ContentGroup = "UseOC",
        Default = "UserNone",
        FullScreen = "FullScreen",
        Thumbnails = "UseThumbs"
    }
}
declare module "types/PdfJs" {
    import { PageMode } from "structs/PageMode";
    export namespace PdfJs {
        const GlobalWorkerOptions: GlobalWorker;
        interface GlobalWorker {
            workerPort: Worker;
            workerSrc: string;
        }
        interface PDFWorkerConstructorParams {
            name: string;
        }
        interface PDFWorker {
            destroyed: boolean;
            destroy(): void;
        }
        interface PDFWorkerConstructor {
            new (params: PDFWorkerConstructorParams): PDFWorker;
        }
        const PasswordResponses: PasswordResponsesValue;
        interface PasswordResponsesValue {
            NEED_PASSWORD: number;
            INCORRECT_PASSWORD: number;
        }
        type FileData = string | Uint8Array;
        interface LoadingTaskProgress {
            loaded: number;
            total: number;
        }
        interface LoadingTask {
            docId: string;
            onPassword: (verifyPassword: (password: string) => void, reason: number) => void;
            onProgress: (progress: LoadingTaskProgress) => void;
            promise: Promise<PdfDocument>;
            destroy(): void;
        }
        interface PdfDocument {
            loadingTask: LoadingTask;
            numPages: number;
            getAttachments(): Promise<{
                [filename: string]: Attachment;
            }>;
            getData(): Promise<Uint8Array>;
            getDestination(dest: string): Promise<OutlineDestination>;
            getDownloadInfo(): Promise<{
                length: number;
            }>;
            getMetadata(): Promise<MetaData>;
            getOutline(): Promise<Outline[]>;
            getPage(pageIndex: number): Promise<Page>;
            getPageIndex(ref: OutlineRef): Promise<number>;
            getPageLabels(): Promise<string[] | null>;
            getPageMode(): Promise<PageMode>;
            getPermissions(): Promise<number[] | null>;
        }
        interface GetDocumentParams {
            data?: FileData;
            cMapUrl?: string;
            cMapPacked?: boolean;
            httpHeaders?: Record<string, string | string[]>;
            url?: string;
            withCredentials?: boolean;
            worker?: PDFWorker;
        }
        function getDocument(params: GetDocumentParams): LoadingTask;
        interface Attachment {
            content: Uint8Array;
            filename: string;
        }
        interface MetaData {
            contentDispositionFilename?: string;
            info: MetaDataInfo;
        }
        interface MetaDataInfo {
            Author: string;
            CreationDate: string;
            Creator: string;
            Keywords: string;
            ModDate: string;
            PDFFormatVersion: string;
            Producer: string;
            Subject: string;
            Title: string;
        }
        type OutlineDestinationType = string | OutlineDestination;
        interface Outline {
            bold?: boolean;
            color?: number[];
            count?: undefined | number;
            dest?: OutlineDestinationType;
            italic?: boolean;
            items: Outline[];
            newWindow?: boolean;
            title: string;
            unsafeUrl?: string;
            url?: string;
        }
        type OutlineDestination = [
            OutlineRef | number,
            OutlineDestinationName,
            ...any[]
        ];
        interface OutlineDestinationName {
            name: string;
        }
        interface OutlineRef {
            gen: number;
            num: number;
        }
        interface ViewPortParams {
            rotation?: number;
            scale: number;
        }
        interface ViewPortCloneParams {
            dontFlip: boolean;
        }
        interface ViewPort {
            height: number;
            rotation: number;
            transform: number[];
            width: number;
            clone(params: ViewPortCloneParams): ViewPort;
            convertToViewportPoint(x: number, y: number): [number, number];
        }
        interface PageRenderTask {
            promise: Promise<any>;
            cancel(): void;
        }
        interface SVGGraphics {
            getSVG(operatorList: PageOperatorList, viewport: ViewPort): Promise<SVGElement>;
        }
        interface SVGGraphicsConstructor {
            new (commonObjs: PageCommonObjects, objs: PageObjects): SVGGraphics;
        }
        let SVGGraphics: SVGGraphicsConstructor;
        interface TextLayerConstructorParams {
            textContentSource: PageTextContent;
            container: HTMLDivElement;
            viewport: ViewPort;
        }
        interface TextLayer {
            new (params: TextLayerConstructorParams): TextLayer;
            render(): Promise<any>;
            cancel(): void;
        }
        interface PageTextContent {
            items: PageTextItem[];
        }
        interface PageTextItem {
            str: string;
        }
        interface AnnotationsParams {
            intent: string;
        }
        interface AnnotationPoint {
            x: number;
            y: number;
        }
        interface Annotation {
            annotationType: number;
            color?: Uint8ClampedArray;
            dest: OutlineDestinationType;
            hasAppearance: boolean;
            id: string;
            rect: number[];
            subtype: string;
            borderStyle: {
                dashArray: number[];
                horizontalCornerRadius: number;
                style: number;
                verticalCornerRadius: number;
                width: number;
            };
            hasPopup?: boolean;
            contents?: string;
            contentsObj?: {
                dir: string;
                str: string;
            };
            modificationDate?: string;
            quadPoints?: AnnotationPoint[][];
            title?: string;
            titleObj?: {
                dir: string;
                str: string;
            };
            parentId?: string;
            parentType?: string;
            file?: Attachment;
            inkLists?: AnnotationPoint[][];
            lineCoordinates: number[];
            action?: string;
            unsafeUrl?: string;
            url?: string;
            newWindow?: boolean;
            vertices?: AnnotationPoint[];
            name?: string;
        }
        const AnnotationLayer: PdfAnnotationLayer;
        interface RenderAnnotationLayerParams {
            annotations: Annotation[];
            div: HTMLDivElement | null;
            linkService: LinkService;
            page: Page;
            viewport: ViewPort;
        }
        interface PdfAnnotationLayer {
            render(params: RenderAnnotationLayerParams): void;
            update(params: RenderAnnotationLayerParams): void;
        }
        interface LinkService {
            externalLinkTarget?: number | null;
            getDestinationHash(dest: OutlineDestinationType): string;
            navigateTo(dest: OutlineDestinationType): void;
        }
        interface PageRenderParams {
            canvasContext: CanvasRenderingContext2D;
            intent?: string;
            transform?: number[];
            viewport: ViewPort;
        }
        interface Page {
            getAnnotations(params: AnnotationsParams): Promise<Annotation[]>;
            getTextContent(): Promise<PageTextContent>;
            getViewport(params: ViewPortParams): ViewPort;
            render(params: PageRenderParams): PageRenderTask;
            getOperatorList(): Promise<PageOperatorList>;
            commonObjs: PageCommonObjects;
            objs: PageObjects;
            ref?: OutlineRef;
            view: number[];
        }
        interface PageCommonObjects {
        }
        interface PageObjects {
        }
        interface PageOperatorList {
        }
    }
}
declare module "types/PdfJsApiProvider" {
    import { type PdfJs } from "types/PdfJs";
    export interface PdfJsApiProvider {
        getDocument(params: PdfJs.GetDocumentParams): PdfJs.LoadingTask;
        PDFWorker: PdfJs.PDFWorkerConstructor;
        GlobalWorkerOptions: PdfJs.GlobalWorker;
        PasswordResponses: PdfJs.PasswordResponsesValue;
        SVGGraphics: PdfJs.SVGGraphicsConstructor;
        TextLayer: PdfJs.TextLayer;
    }
}
declare module "vendors/PdfJsApiContext" {
    import * as React from 'react';
    import { type PdfJsApiProvider } from "types/PdfJsApiProvider";
    export interface PdfJsApiContextProps {
        pdfJsApiProvider?: PdfJsApiProvider;
    }
    export const PdfJsApiContext: React.Context<PdfJsApiContextProps>;
}
declare module "Provider" {
    import * as React from 'react';
    import { TextDirection } from "theme/ThemeContext";
    import { type LocalizationMap } from "types/LocalizationMap";
    import { type PdfJsApiProvider } from "types/PdfJsApiProvider";
    export interface ThemeProps {
        direction?: TextDirection;
        theme?: string;
    }
    export const Provider: React.FC<{
        children?: React.ReactNode;
        localization?: LocalizationMap;
        pdfApiProvider: PdfJsApiProvider;
        theme?: string | ThemeProps;
        workerUrl: string;
    }>;
}
declare module "hooks/useIsomorphicLayoutEffect" {
    import * as React from 'react';
    export const useIsomorphicLayoutEffect: typeof React.useEffect;
}
declare module "types/VisibilityChanged" {
    export interface VisibilityChanged {
        isVisible: boolean;
        ratio: number;
    }
}
declare module "hooks/useIntersectionObserver" {
    import * as React from 'react';
    import { type VisibilityChanged } from "types/VisibilityChanged";
    interface UseIntersectionObserverProps {
        once?: boolean;
        threshold?: number | number[];
        onVisibilityChanged(params: VisibilityChanged): void;
    }
    export const useIntersectionObserver: (props: UseIntersectionObserverProps) => React.MutableRefObject<HTMLDivElement | null>;
}
declare module "hooks/usePrevious" {
    export const usePrevious: <T>(value: T) => T;
}
declare module "hooks/useDebounceCallback" {
    export const useDebounceCallback: <T extends unknown[]>(callback: (...args: T) => void, wait: number) => (...args: T) => void;
}
declare module "types/Rect" {
    export interface Rect {
        height: number;
        width: number;
    }
}
declare module "hooks/useWindowResize" {
    import { type Rect } from "types/Rect";
    export const useWindowResize: () => Rect;
}
declare module "structs/FullScreenMode" {
    export enum FullScreenMode {
        Normal = "Normal",
        Entering = "Entering",
        Entered = "Entered",
        Exitting = "Exitting",
        Exited = "Exited"
    }
}
declare module "fullscreen/fullScreen" {
    const isFullScreenEnabled: () => boolean;
    const addFullScreenChangeListener: (handler: () => void) => void;
    const removeFullScreenChangeListener: (handler: () => void) => void;
    const exitFullScreen: (element: Element | Document) => Promise<void>;
    const getFullScreenElement: () => Element | null;
    const requestFullScreen: (element: Element) => void;
    export { addFullScreenChangeListener, exitFullScreen, getFullScreenElement, isFullScreenEnabled, removeFullScreenChangeListener, requestFullScreen, };
}
declare module "fullscreen/useFullScreen" {
    import * as React from 'react';
    import { FullScreenMode } from "structs/FullScreenMode";
    export const useFullScreen: ({ targetRef }: {
        targetRef: React.RefObject<HTMLElement>;
    }) => {
        enterFullScreenMode: (target: HTMLElement) => void;
        exitFullScreenMode: () => void;
        fullScreenMode: FullScreenMode;
    };
}
declare module "hooks/useAnimationFrame" {
    export const useAnimationFrame: <T extends unknown[]>(callback: (...args: T) => void, recurring: boolean | undefined, deps: unknown[]) => [(...args: T) => void];
}
declare module "hooks/useRenderQueue" {
    import { type PdfJs } from "types/PdfJs";
    export interface UseRenderQueue {
        getHighestPriorityPage: () => number;
        isInRange: (pageIndex: number) => boolean;
        markNotRendered: () => void;
        markRendered: (pageIndex: number) => void;
        markRendering: (pageIndex: number) => void;
        setOutOfRange: (pageIndex: number) => void;
        setRange: (startIndex: number, endIndex: number) => void;
        setVisibility: (pageIndex: number, visibility: number) => void;
    }
    export const useRenderQueue: ({ doc }: {
        doc: PdfJs.PdfDocument;
    }) => UseRenderQueue;
}
declare module "hooks/useTrackResize" {
    import * as React from 'react';
    interface UseTrackResizeProps {
        targetRef: React.RefObject<HTMLDivElement>;
        onResize(target: Element): void;
    }
    export const useTrackResize: ({ targetRef, onResize }: UseTrackResizeProps) => void;
}
declare module "structs/SpecialZoomLevel" {
    export enum SpecialZoomLevel {
        ActualSize = "ActualSize",
        PageFit = "PageFit",
        PageWidth = "PageWidth"
    }
}
declare module "types/Destination" {
    import { SpecialZoomLevel } from "structs/SpecialZoomLevel";
    export type DestinationOffsetFromViewport = (viewportWidth: number, viewportHeight: number) => number;
    export interface Destination {
        bottomOffset: number | DestinationOffsetFromViewport;
        label?: string;
        leftOffset: number | DestinationOffsetFromViewport;
        pageIndex: number;
        scaleTo?: number | SpecialZoomLevel;
    }
}
declare module "structs/LayerRenderStatus" {
    export enum LayerRenderStatus {
        PreRender = 0,
        DidRender = 1
    }
}
declare module "types/OpenFile" {
    import { type PdfJs } from "types/PdfJs";
    export interface OpenFile {
        data: PdfJs.FileData;
        name: string;
    }
}
declare module "structs/RotateDirection" {
    export enum RotateDirection {
        Backward = "Backward",
        Forward = "Forward"
    }
}
declare module "structs/ScrollMode" {
    export enum ScrollMode {
        Page = "Page",
        Horizontal = "Horizontal",
        Vertical = "Vertical",
        Wrapped = "Wrapped"
    }
}
declare module "structs/ViewMode" {
    export enum ViewMode {
        DualPage = "DualPage",
        DualPageWithCover = "DualPageWithCover",
        SinglePage = "SinglePage"
    }
}
declare module "types/ViewerState" {
    import { FullScreenMode } from "structs/FullScreenMode";
    import { ScrollMode } from "structs/ScrollMode";
    import { ViewMode } from "structs/ViewMode";
    import { type OpenFile } from "types/OpenFile";
    export interface ViewerState {
        file: OpenFile;
        fullScreenMode: FullScreenMode;
        pageIndex: number;
        pageHeight: number;
        pageWidth: number;
        pagesRotation: Map<number, number>;
        rotatedPage?: number;
        rotation: number;
        scale: number;
        scrollMode: ScrollMode;
        viewMode: ViewMode;
    }
}
declare module "types/PluginFunctions" {
    import { RotateDirection } from "structs/RotateDirection";
    import { ScrollMode } from "structs/ScrollMode";
    import { SpecialZoomLevel } from "structs/SpecialZoomLevel";
    import { ViewMode } from "structs/ViewMode";
    import { type Destination } from "types/Destination";
    import { type ViewerState } from "types/ViewerState";
    export interface PluginFunctions {
        enterFullScreenMode(target: HTMLElement): void;
        exitFullScreenMode(): void;
        getPagesContainer(): HTMLElement;
        getViewerState(): ViewerState;
        jumpToDestination(destination: Destination): Promise<void>;
        jumpToNextDestination(): Promise<void>;
        jumpToPreviousDestination(): Promise<void>;
        jumpToNextPage(): Promise<void>;
        jumpToPreviousPage(): Promise<void>;
        jumpToPage(pageIndex: number): Promise<void>;
        openFile(file: File): void;
        rotate(direction: RotateDirection): void;
        rotatePage(pageIndex: number, direction: RotateDirection): void;
        setViewerState(viewerState: ViewerState): void;
        switchScrollMode(scrollMode: ScrollMode): void;
        switchViewMode(viewMode: ViewMode): void;
        zoom(scale: number | SpecialZoomLevel): void;
    }
}
declare module "types/PageSize" {
    export interface PageSize {
        pageHeight: number;
        pageWidth: number;
        rotation: number;
    }
}
declare module "types/Slot" {
    import * as React from 'react';
    export interface Attr extends React.HTMLAttributes<HTMLDivElement> {
        'data-testid'?: string;
        ref?: React.MutableRefObject<HTMLDivElement | null>;
    }
    export interface Slot {
        attrs?: Attr;
        children?: React.ReactNode;
        subSlot?: Slot;
    }
}
declare module "types/RenderViewer" {
    import * as React from 'react';
    import { RotateDirection } from "structs/RotateDirection";
    import { ScrollMode } from "structs/ScrollMode";
    import { SpecialZoomLevel } from "structs/SpecialZoomLevel";
    import { ViewMode } from "structs/ViewMode";
    import { type ThemeContextProps } from "theme/ThemeContext";
    import { type PdfJs } from "types/PdfJs";
    import { type PageSize } from "types/PageSize";
    import { type Slot } from "types/Slot";
    export interface RenderViewer {
        containerRef: React.RefObject<HTMLDivElement>;
        doc: PdfJs.PdfDocument;
        pagesContainerRef: React.RefObject<HTMLDivElement>;
        pagesRotation: Map<number, number>;
        pageSizes: PageSize[];
        rotation: number;
        slot: Slot;
        themeContext: ThemeContextProps;
        openFile(file: File): void;
        jumpToPage(page: number): void;
        rotate(direction: RotateDirection): void;
        rotatePage(pageIndex: number, direction: RotateDirection): void;
        switchScrollMode(scrollMode: ScrollMode): void;
        switchViewMode(viewMode: ViewMode): void;
        zoom(level: number | SpecialZoomLevel): void;
    }
}
declare module "types/Plugin" {
    import * as React from 'react';
    import { LayerRenderStatus } from "structs/LayerRenderStatus";
    import { type OpenFile } from "types/OpenFile";
    import { type PdfJs } from "types/PdfJs";
    import { type PluginFunctions } from "types/PluginFunctions";
    import { type RenderViewer } from "types/RenderViewer";
    import { type Slot } from "types/Slot";
    import { type ViewerState } from "types/ViewerState";
    export interface PluginOnDocumentLoad {
        doc: PdfJs.PdfDocument;
        file: OpenFile;
    }
    export interface PluginOnTextLayerRender {
        ele: HTMLElement;
        pageIndex: number;
        scale: number;
        status: LayerRenderStatus;
    }
    export interface PluginOnAnnotationLayerRender {
        annotations: PdfJs.Annotation[];
        container: HTMLElement;
        pageIndex: number;
        scale: number;
        rotation: number;
    }
    export interface PluginOnCanvasLayerRender {
        ele: HTMLCanvasElement;
        pageIndex: number;
        rotation: number;
        scale: number;
        status: LayerRenderStatus;
    }
    export interface PluginRenderPageLayer {
        canvasLayerRef: React.RefObject<HTMLCanvasElement>;
        canvasLayerRendered: boolean;
        doc: PdfJs.PdfDocument;
        height: number;
        pageIndex: number;
        rotation: number;
        scale: number;
        textLayerRef: React.RefObject<HTMLDivElement>;
        textLayerRendered: boolean;
        width: number;
    }
    export interface Plugin {
        dependencies?: Plugin[];
        install?(pluginFunctions: PluginFunctions): void;
        renderPageLayer?(props: PluginRenderPageLayer): React.ReactElement;
        renderViewer?(props: RenderViewer): Slot;
        uninstall?(pluginFunctions: PluginFunctions): void;
        onAnnotationLayerRender?(props: PluginOnAnnotationLayerRender): void;
        onCanvasLayerRender?(props: PluginOnCanvasLayerRender): void;
        onDocumentLoad?(props: PluginOnDocumentLoad): void;
        onTextLayerRender?(props: PluginOnTextLayerRender): void;
        onViewerStateChange?(viewerState: ViewerState): ViewerState;
    }
}
declare module "annotations/AnnotationType" {
    export enum AnnotationType {
        Text = 1,
        Link = 2,
        FreeText = 3,
        Line = 4,
        Square = 5,
        Circle = 6,
        Polygon = 7,
        Polyline = 8,
        Highlight = 9,
        Underline = 10,
        Squiggly = 11,
        StrikeOut = 12,
        Stamp = 13,
        Caret = 14,
        Ink = 15,
        Popup = 16,
        FileAttachment = 17
    }
}
declare module "annotations/AnnotationBorderStyleType" {
    export enum AnnotationBorderStyleType {
        Solid = 1,
        Dashed = 2,
        Beveled = 3,
        Inset = 4,
        Underline = 5
    }
}
declare module "utils/classNames" {
    export const classNames: (classes: {
        [clazz: string]: boolean;
    }) => string;
}
declare module "utils/convertDate" {
    export const convertDate: (input: string) => Date | null;
}
declare module "annotations/getContents" {
    import { type PdfJs } from "types/PdfJs";
    export const getContents: (annotation: PdfJs.Annotation) => string;
}
declare module "annotations/getTitle" {
    import { type PdfJs } from "types/PdfJs";
    export const getTitle: (annotation: PdfJs.Annotation) => string;
}
declare module "annotations/PopupWrapper" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const PopupWrapper: React.FC<{
        annotation: PdfJs.Annotation;
    }>;
}
declare module "structs/ToggleStatus" {
    export enum ToggleStatus {
        Close = "Close",
        Open = "Open",
        Toggle = "Toggle"
    }
}
declare module "types/Toggle" {
    import { ToggleStatus } from "structs/ToggleStatus";
    export type Toggle = (status?: ToggleStatus) => void;
}
declare module "hooks/useToggle" {
    import { type Toggle } from "types/Toggle";
    export const useToggle: (isOpened: boolean) => {
        opened: boolean;
        toggle: Toggle;
    };
}
declare module "annotations/useTogglePopup" {
    export const useTogglePopup: () => {
        opened: boolean;
        closeOnHover: () => void;
        openOnHover: () => void;
        toggleOnClick: () => void;
    };
}
declare module "annotations/Annotation" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    import { type Slot } from "types/Slot";
    interface RenderChildrenProps {
        popup: {
            opened: boolean;
            closeOnHover: () => void;
            openOnHover: () => void;
            toggleOnClick: () => void;
        };
        slot: Slot;
    }
    export const Annotation: React.FC<{
        annotation: PdfJs.Annotation;
        hasPopup: boolean;
        ignoreBorder: boolean;
        isRenderable: boolean;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
        children(props: RenderChildrenProps): React.ReactElement;
    }>;
}
declare module "annotations/Caret" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Caret: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/Circle" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Circle: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "utils/getFileName" {
    export const getFileName: (url: string) => string;
}
declare module "utils/downloadFile" {
    import { type PdfJs } from "types/PdfJs";
    export const downloadFile: (url: string, data: PdfJs.FileData) => void;
}
declare module "annotations/FileAttachment" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const FileAttachment: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/FreeText" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const FreeText: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/Popup" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Popup: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/Highlight" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Highlight: React.FC<{
        annotation: PdfJs.Annotation;
        childAnnotation?: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/Ink" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Ink: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/Line" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Line: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "utils/managePages" {
    import { type Destination } from "types/Destination";
    import { type PdfJs } from "types/PdfJs";
    export const clearPagesCache: () => void;
    export const getPage: (doc: PdfJs.PdfDocument, pageIndex: number) => Promise<PdfJs.Page>;
    export const getDestination: (doc: PdfJs.PdfDocument, dest: PdfJs.OutlineDestinationType) => Promise<Destination>;
}
declare module "utils/sanitizeUrl" {
    export const sanitizeUrl: (url: string, defaultUrl?: string) => string;
}
declare module "annotations/Link" {
    import * as React from 'react';
    import { type Destination } from "types/Destination";
    import { type PdfJs } from "types/PdfJs";
    export const Link: React.FC<{
        annotation: PdfJs.Annotation;
        annotationContainerRef: React.RefObject<HTMLElement>;
        doc: PdfJs.PdfDocument;
        outlines: PdfJs.Outline[];
        page: PdfJs.Page;
        pageIndex: number;
        scale: number;
        viewport: PdfJs.ViewPort;
        onExecuteNamedAction(action: string): void;
        onJumpFromLinkAnnotation(destination: Destination): void;
        onJumpToDest(destination: Destination): void;
    }>;
}
declare module "annotations/Polygon" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Polygon: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/Polyline" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Polyline: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/Square" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Square: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/Squiggly" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Squiggly: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/Stamp" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Stamp: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/StrikeOut" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const StrikeOut: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "icons/Icon" {
    import * as React from 'react';
    export const Icon: React.FC<{
        children?: React.ReactNode;
        ignoreDirection?: boolean;
        size?: number;
    }>;
}
declare module "icons/CheckIcon" {
    import * as React from 'react';
    export const CheckIcon: React.FC;
}
declare module "icons/CommentIcon" {
    import * as React from 'react';
    export const CommentIcon: React.FC;
}
declare module "icons/HelpIcon" {
    import * as React from 'react';
    export const HelpIcon: React.FC;
}
declare module "icons/KeyIcon" {
    import * as React from 'react';
    export const KeyIcon: React.FC;
}
declare module "icons/NoteIcon" {
    import * as React from 'react';
    export const NoteIcon: React.FC;
}
declare module "icons/ParagraphIcon" {
    import * as React from 'react';
    export const ParagraphIcon: React.FC;
}
declare module "icons/TriangleIcon" {
    import * as React from 'react';
    export const TriangleIcon: React.FC;
}
declare module "annotations/Text" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Text: React.FC<{
        annotation: PdfJs.Annotation;
        childAnnotation?: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/Underline" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const Underline: React.FC<{
        annotation: PdfJs.Annotation;
        page: PdfJs.Page;
        viewport: PdfJs.ViewPort;
    }>;
}
declare module "annotations/AnnotationLayerBody" {
    import * as React from 'react';
    import { type Destination } from "types/Destination";
    import { type PdfJs } from "types/PdfJs";
    import { type Plugin } from "types/Plugin";
    export const AnnotationLayerBody: React.FC<{
        annotations: PdfJs.Annotation[];
        doc: PdfJs.PdfDocument;
        outlines: PdfJs.Outline[];
        page: PdfJs.Page;
        pageIndex: number;
        plugins: Plugin[];
        rotation: number;
        scale: number;
        onExecuteNamedAction(action: string): void;
        onJumpFromLinkAnnotation(destination: Destination): void;
        onJumpToDest(destination: Destination): void;
    }>;
}
declare module "hooks/useIsMounted" {
    import * as React from 'react';
    export const useIsMounted: () => React.MutableRefObject<boolean>;
}
declare module "hooks/useSafeState" {
    import * as React from 'react';
    export const useSafeState: <T>(initialState: T | (() => T)) => [T, React.Dispatch<React.SetStateAction<T>>];
}
declare module "annotations/AnnotationLoader" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const AnnotationLoader: React.FC<{
        page: PdfJs.Page;
        renderAnnotations(annotations: PdfJs.Annotation[]): React.ReactElement;
    }>;
}
declare module "annotations/AnnotationLayer" {
    import * as React from 'react';
    import { type Destination } from "types/Destination";
    import { type PdfJs } from "types/PdfJs";
    import { type Plugin } from "types/Plugin";
    export const AnnotationLayer: React.FC<{
        doc: PdfJs.PdfDocument;
        outlines: PdfJs.Outline[];
        page: PdfJs.Page;
        pageIndex: number;
        plugins: Plugin[];
        rotation: number;
        scale: number;
        onExecuteNamedAction(action: string): void;
        onJumpFromLinkAnnotation(destination: Destination): void;
        onJumpToDest(destination: Destination): void;
    }>;
}
declare module "components/Spinner" {
    import * as React from 'react';
    export const Spinner: React.FC<{
        size?: string;
        testId?: string;
    }>;
}
declare module "types/RenderPage" {
    import * as React from 'react';
    import { RotateDirection } from "structs/RotateDirection";
    import { type PdfJs } from "types/PdfJs";
    import { type Slot } from "types/Slot";
    export interface RenderPageProps {
        annotationLayer: Slot;
        canvasLayer: Slot;
        canvasLayerRendered: boolean;
        doc: PdfJs.PdfDocument;
        height: number;
        pageIndex: number;
        rotation: number;
        scale: number;
        svgLayer: Slot;
        textLayer: Slot;
        textLayerRendered: boolean;
        width: number;
        markRendered(pageIndex: number): void;
        onRotatePage(direction: RotateDirection): void;
    }
    export type RenderPage = (props: RenderPageProps) => React.ReactElement;
}
declare module "utils/floatToRatio" {
    export const floatToRatio: (x: number, limit: number) => [number, number];
}
declare module "utils/roundToDivide" {
    export const roundToDivide: (a: number, b: number) => number;
}
declare module "layers/CanvasLayer" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    import { type Plugin } from "types/Plugin";
    export const CanvasLayer: React.FC<{
        canvasLayerRef: React.RefObject<HTMLCanvasElement>;
        height: number;
        page: PdfJs.Page;
        pageIndex: number;
        plugins: Plugin[];
        rotation: number;
        scale: number;
        width: number;
        onRenderCanvasCompleted: () => void;
    }>;
}
declare module "layers/SvgLayer" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    export const SvgLayer: React.FC<{
        height: number;
        page: PdfJs.Page;
        rotation: number;
        scale: number;
        width: number;
    }>;
}
declare module "layers/TextLayer" {
    import * as React from 'react';
    import { type PdfJs } from "types/PdfJs";
    import { type Plugin } from "types/Plugin";
    export const TextLayer: React.FC<{
        containerRef: React.RefObject<HTMLDivElement>;
        page: PdfJs.Page;
        pageIndex: number;
        plugins: Plugin[];
        rotation: number;
        scale: number;
        onRenderTextCompleted: () => void;
    }>;
}
declare module "layers/PageLayer" {
    import * as React from 'react';
    import { RotateDirection } from "structs/RotateDirection";
    import { ViewMode } from "structs/ViewMode";
    import { type Destination } from "types/Destination";
    import { type PageSize } from "types/PageSize";
    import { type PdfJs } from "types/PdfJs";
    import { type Plugin } from "types/Plugin";
    import { type RenderPage } from "types/RenderPage";
    export const PageLayer: React.FC<{
        doc: PdfJs.PdfDocument;
        measureRef: React.RefCallback<HTMLElement>;
        outlines: PdfJs.Outline[];
        pageIndex: number;
        pageRotation: number;
        pageSize: PageSize;
        plugins: Plugin[];
        renderPage?: RenderPage;
        renderQueueKey: number;
        rotation: number;
        scale: number;
        shouldRender: boolean;
        viewMode: ViewMode;
        onExecuteNamedAction(action: string): void;
        onJumpFromLinkAnnotation(destination: Destination): void;
        onJumpToDest(destination: Destination): void;
        onRenderCompleted(pageIndex: number): void;
        onRotatePage(pageIndex: number, direction: RotateDirection): void;
    }>;
}
declare module "types/DocumentLoadEvent" {
    import { type OpenFile } from "types/OpenFile";
    import { type PdfJs } from "types/PdfJs";
    export interface DocumentLoadEvent {
        doc: PdfJs.PdfDocument;
        file: OpenFile;
    }
}
declare module "types/Offset" {
    export interface Offset {
        left: number;
        top: number;
    }
}
declare module "types/PageChangeEvent" {
    import { type PdfJs } from "types/PdfJs";
    export interface PageChangeEvent {
        currentPage: number;
        doc: PdfJs.PdfDocument;
    }
}
declare module "types/PageLayout" {
    import * as React from 'react';
    import { ScrollMode } from "structs/ScrollMode";
    import { ViewMode } from "structs/ViewMode";
    import { type Rect } from "types/Rect";
    export interface PageLayout {
        buildPageStyles?: ({ numPages, pageIndex, scrollMode, viewMode, }: {
            numPages: number;
            pageIndex: number;
            scrollMode: ScrollMode;
            viewMode: ViewMode;
        }) => React.CSSProperties;
        transformSize?: ({ numPages, pageIndex, size }: {
            numPages: number;
            pageIndex: number;
            size: Rect;
        }) => Rect;
    }
}
declare module "types/RotateEvent" {
    import { RotateDirection } from "structs/RotateDirection";
    import { type PdfJs } from "types/PdfJs";
    export interface RotateEvent {
        direction: RotateDirection;
        doc: PdfJs.PdfDocument;
        rotation: number;
    }
}
declare module "types/RotatePageEvent" {
    import { RotateDirection } from "structs/RotateDirection";
    import { type PdfJs } from "types/PdfJs";
    export interface RotatePageEvent {
        direction: RotateDirection;
        doc: PdfJs.PdfDocument;
        pageIndex: number;
        rotation: number;
    }
}
declare module "types/SetRenderRange" {
    export interface VisiblePagesRange {
        endPage: number;
        numPages: number;
        startPage: number;
    }
    export type SetRenderRange = (visiblePagesRange: VisiblePagesRange) => {
        endPage: number;
        startPage: number;
    };
}
declare module "types/ZoomEvent" {
    import { type PdfJs } from "types/PdfJs";
    export interface ZoomEvent {
        doc: PdfJs.PdfDocument;
        scale: number;
    }
}
declare module "utils/chunk" {
    export const chunk: <T>(arr: T[], size: number) => T[][];
}
declare module "utils/getFileExt" {
    export const getFileExt: (url: string) => string;
}
declare module "virtualizer/ItemMeasurement" {
    import { type Offset } from "types/Offset";
    import { type Rect } from "types/Rect";
    export interface ItemMeasurement {
        index: number;
        start: Offset;
        size: Rect;
        end: Offset;
        visibility: number;
    }
}
declare module "virtualizer/VirtualItem" {
    import { type ItemMeasurement } from "virtualizer/ItemMeasurement";
    export interface VirtualItem extends ItemMeasurement {
        measureRef: (ele: HTMLElement) => void;
    }
}
declare module "hooks/useMeasureRect" {
    import * as React from 'react';
    import { type Rect } from "types/Rect";
    export const useMeasureRect: ({ elementRef }: {
        elementRef: React.RefObject<HTMLDivElement>;
    }) => Rect;
}
declare module "structs/ScrollDirection" {
    export enum ScrollDirection {
        Horizontal = "Horizontal",
        Vertical = "Vertical",
        Both = "Both"
    }
}
declare module "utils/easeOutQuart" {
    export const easeOutQuart: (t: number) => number;
}
declare module "utils/smoothScroll" {
    import { ScrollDirection } from "structs/ScrollDirection";
    import { type Offset } from "types/Offset";
    export const smoothScroll: (ele: HTMLElement, scrollDirection: ScrollDirection, targetPosition: Offset, duration: number, easing?: (t: number) => number, onReachTarget?: () => void) => void;
}
declare module "hooks/useScroll" {
    import * as React from 'react';
    import { ScrollDirection } from "structs/ScrollDirection";
    import { type Offset } from "types/Offset";
    export const useScroll: ({ elementRef, enableSmoothScroll, isRtl, scrollDirection, onSmoothScroll, }: {
        elementRef: React.RefObject<HTMLDivElement>;
        enableSmoothScroll: boolean;
        isRtl: boolean;
        scrollDirection: ScrollDirection;
        onSmoothScroll: (isScrollingSmoothly: boolean) => void;
    }) => {
        scrollOffset: Offset;
        scrollTo: (offset: Offset, withSmoothScroll: boolean) => Promise<void>;
    };
}
declare module "utils/clamp" {
    export const clamp: (min: number, max: number, value: number) => number;
}
declare module "utils/indexOfMax" {
    export const indexOfMax: (arr: number[]) => number;
}
declare module "virtualizer/buildContainerStyles" {
    import * as React from 'react';
    import { ScrollMode } from "structs/ScrollMode";
    import { type Rect } from "types/Rect";
    export const buildContainerStyles: (totalSize: Rect, scrollMode: ScrollMode) => React.CSSProperties;
}
declare module "virtualizer/buildItemContainerStyles" {
    import * as React from 'react';
    import { ScrollMode } from "structs/ScrollMode";
    import { type Rect } from "types/Rect";
    import { type VirtualItem } from "virtualizer/VirtualItem";
    export const buildItemContainerStyles: (item: VirtualItem, parentRect: Rect, scrollMode: ScrollMode) => React.CSSProperties;
}
declare module "virtualizer/buildItemStyles" {
    import * as React from 'react';
    import { ScrollMode } from "structs/ScrollMode";
    import { ViewMode } from "structs/ViewMode";
    import { type Rect } from "types/Rect";
    import { type VirtualItem } from "virtualizer/VirtualItem";
    export const buildItemStyles: (item: VirtualItem, isRtl: boolean, sizes: Rect[], viewMode: ViewMode, scrollMode: ScrollMode) => React.CSSProperties;
}
declare module "utils/findNearest" {
    export const findNearest: (low: number, high: number, value: number, getItemValue: (index: number) => number) => number;
}
declare module "virtualizer/calculateRange" {
    import { ScrollDirection } from "structs/ScrollDirection";
    import { type Offset } from "types/Offset";
    import { type Rect } from "types/Rect";
    import { type ItemMeasurement } from "virtualizer/ItemMeasurement";
    export const calculateRange: (scrollDirection: ScrollDirection, measurements: ItemMeasurement[], outerSize: Rect, scrollOffset: Offset) => {
        start: number;
        end: number;
    };
}
declare module "virtualizer/measure" {
    import { ScrollMode } from "structs/ScrollMode";
    import { type Rect } from "types/Rect";
    import { type ItemMeasurement } from "virtualizer/ItemMeasurement";
    export const measure: (numberOfItems: number, parentRect: Rect, sizes: Rect[], scrollMode: ScrollMode) => ItemMeasurement[];
}
declare module "virtualizer/measureDualPage" {
    import { ScrollMode } from "structs/ScrollMode";
    import { type Rect } from "types/Rect";
    import { type ItemMeasurement } from "virtualizer/ItemMeasurement";
    export const measureDualPage: (numberOfItems: number, parentRect: Rect, sizes: Rect[], scrollMode: ScrollMode) => ItemMeasurement[];
}
declare module "virtualizer/measureDualPageWithCover" {
    import { ScrollMode } from "structs/ScrollMode";
    import { type Rect } from "types/Rect";
    import { type ItemMeasurement } from "virtualizer/ItemMeasurement";
    export const measureDualPageWithCover: (numberOfItems: number, parentRect: Rect, sizes: Rect[], scrollMode: ScrollMode) => ItemMeasurement[];
}
declare module "virtualizer/measureSinglePage" {
    import { type Rect } from "types/Rect";
    import { type ItemMeasurement } from "virtualizer/ItemMeasurement";
    export const measureSinglePage: (numberOfItems: number, parentRect: Rect, sizes: Rect[]) => ItemMeasurement[];
}
declare module "virtualizer/useVirtual" {
    import * as React from 'react';
    import { ScrollMode } from "structs/ScrollMode";
    import { ViewMode } from "structs/ViewMode";
    import { type Offset } from "types/Offset";
    import { type Rect } from "types/Rect";
    import { type SetRenderRange } from "types/SetRenderRange";
    import { type VirtualItem } from "virtualizer/VirtualItem";
    export const useVirtual: ({ enableSmoothScroll, isRtl, numberOfItems, parentRef, setRenderRange, sizes, scrollMode, viewMode, onVisibilityChanged, }: {
        enableSmoothScroll: boolean;
        isRtl: boolean;
        numberOfItems: number;
        parentRef: React.RefObject<HTMLDivElement>;
        setRenderRange: SetRenderRange;
        sizes: Rect[];
        scrollMode: ScrollMode;
        viewMode: ViewMode;
        onVisibilityChanged: (pageIndex: number, visibility: number) => void;
    }) => {
        boundingClientRect: Rect;
        isSmoothScrolling: boolean;
        startPage: number;
        endPage: number;
        maxVisbilityIndex: number;
        virtualItems: VirtualItem[];
        getContainerStyles: () => React.CSSProperties;
        getItemContainerStyles: (item: VirtualItem) => React.CSSProperties;
        getItemStyles: (item: VirtualItem) => React.CSSProperties;
        scrollToItem: (index: number, offset: Offset) => Promise<void>;
        scrollToNextItem: (index: number, offset: Offset) => Promise<void>;
        scrollToPreviousItem: (index: number, offset: Offset) => Promise<void>;
        zoom: (scale: number, index: number) => Promise<void>;
    };
}
declare module "layouts/calculateScale" {
    import { SpecialZoomLevel } from "structs/SpecialZoomLevel";
    import { ViewMode } from "structs/ViewMode";
    export const calculateScale: (container: HTMLElement, pageHeight: number, pageWidth: number, scale: SpecialZoomLevel, viewMode: ViewMode, numPages: number) => number;
}
declare module "hooks/useQueue" {
    export const useQueue: <T>(maxLength: number) => {
        dequeue: () => T | null;
        enqueue: (item: T) => void;
        map: <V>(transformer: (item: T) => V) => V[];
    };
}
declare module "hooks/useStack" {
    export const useStack: <T>(maxLength: number) => {
        push: (item: T) => void;
        map: <V>(transformer: (item: T) => V) => V[];
        pop: () => T | null;
    };
}
declare module "layouts/useDestination" {
    import { type Destination } from "types/Destination";
    export const useDestination: ({ getCurrentPage }: {
        getCurrentPage: () => number;
    }) => {
        getNextDestination: () => Destination | null;
        getPreviousDestination: () => Destination | null;
        markVisitedDestination: (destination: Destination) => void;
    };
}
declare module "layouts/useOutlines" {
    import { type PdfJs } from "types/PdfJs";
    export const useOutlines: (doc: PdfJs.PdfDocument) => PdfJs.Outline[];
}
declare module "layouts/Inner" {
    import * as React from 'react';
    import { ScrollMode } from "structs/ScrollMode";
    import { SpecialZoomLevel } from "structs/SpecialZoomLevel";
    import { ViewMode } from "structs/ViewMode";
    import { type DocumentLoadEvent } from "types/DocumentLoadEvent";
    import { type OpenFile } from "types/OpenFile";
    import { type PageChangeEvent } from "types/PageChangeEvent";
    import { type PageLayout } from "types/PageLayout";
    import { type PageSize } from "types/PageSize";
    import { type PdfJs } from "types/PdfJs";
    import { type Plugin } from "types/Plugin";
    import { type RenderPage } from "types/RenderPage";
    import { type RotateEvent } from "types/RotateEvent";
    import { type RotatePageEvent } from "types/RotatePageEvent";
    import { type SetRenderRange } from "types/SetRenderRange";
    import { type ViewerState } from "types/ViewerState";
    import { type ZoomEvent } from "types/ZoomEvent";
    export const Inner: React.FC<{
        currentFile: OpenFile;
        defaultScale?: number | SpecialZoomLevel;
        doc: PdfJs.PdfDocument;
        enableSmoothScroll: boolean;
        estimatedPageSizes: PageSize[];
        initialPage: number;
        initialRotation: number;
        initialScale: number;
        initialScrollMode: ScrollMode;
        initialViewMode: ViewMode;
        pageLayout?: PageLayout;
        plugins: Plugin[];
        renderPage?: RenderPage;
        setRenderRange: SetRenderRange;
        viewerState: ViewerState;
        onDocumentLoad(e: DocumentLoadEvent): void;
        onOpenFile(fileName: string, data: Uint8Array): void;
        onPageChange(e: PageChangeEvent): void;
        onRotate(e: RotateEvent): void;
        onRotatePage(e: RotatePageEvent): void;
        onZoom(e: ZoomEvent): void;
    }>;
}
declare module "zoom/zoomingLevel" {
    export const increase: (currentLevel: number) => number;
    export const decrease: (currentLevel: number) => number;
}
declare module "layouts/PageSizeCalculator" {
    import * as React from 'react';
    import { ScrollMode } from "structs/ScrollMode";
    import { SpecialZoomLevel } from "structs/SpecialZoomLevel";
    import { ViewMode } from "structs/ViewMode";
    import { type PageSize } from "types/PageSize";
    import { type PdfJs } from "types/PdfJs";
    export const PageSizeCalculator: React.FC<{
        defaultScale?: number | SpecialZoomLevel;
        doc: PdfJs.PdfDocument;
        render(estimatedPageSizes: PageSize[], initialScale: number): React.ReactElement;
        scrollMode: ScrollMode;
        viewMode: ViewMode;
    }>;
}
declare module "structs/PasswordStatus" {
    export enum PasswordStatus {
        RequiredPassword = "RequiredPassword",
        WrongPassword = "WrongPassword"
    }
}
declare module "types/CharacterMap" {
    export interface CharacterMap {
        isCompressed: boolean;
        url: string;
    }
}
declare module "types/DocumentAskPasswordEvent" {
    export interface DocumentAskPasswordEvent {
        verifyPassword: (password: string) => void;
    }
}
declare module "types/RenderProtectedView" {
    import * as React from 'react';
    import { PasswordStatus } from "structs/PasswordStatus";
    export interface RenderProtectedViewProps {
        passwordStatus: PasswordStatus;
        verifyPassword: (password: string) => void;
    }
    export type RenderProtectedView = (renderProps: RenderProtectedViewProps) => React.ReactElement;
}
declare module "loader/LoadingStatus" {
    export class LoadingStatus {
    }
}
declare module "loader/AskForPasswordState" {
    import { LoadingStatus } from "loader/LoadingStatus";
    import { PasswordStatus } from "structs/PasswordStatus";
    export class AskForPasswordState extends LoadingStatus {
        verifyPassword: (password: string) => void;
        passwordStatus: PasswordStatus;
        constructor(verifyPassword: (password: string) => void, passwordStatus: PasswordStatus);
    }
}
declare module "components/PrimaryButton" {
    import * as React from 'react';
    export const PrimaryButton: React.FC<{
        children?: React.ReactNode;
        testId?: string;
        onClick(): void;
    }>;
}
declare module "components/TextBox" {
    import * as React from 'react';
    export const TextBox: React.FC<{
        ariaLabel?: string;
        autoFocus?: boolean;
        placeholder?: string;
        testId?: string;
        type?: 'text' | 'password';
        value?: string;
        onChange: (value: string) => void;
        onKeyDown?: (e: React.KeyboardEvent) => void;
    }>;
}
declare module "loader/AskingPassword" {
    import * as React from 'react';
    import { PasswordStatus } from "structs/PasswordStatus";
    import { type DocumentAskPasswordEvent } from "types/DocumentAskPasswordEvent";
    import { type RenderProtectedView } from "types/RenderProtectedView";
    export const AskingPassword: React.FC<{
        passwordStatus: PasswordStatus;
        renderProtectedView?: RenderProtectedView;
        verifyPassword: (password: string) => void;
        onDocumentAskPassword?(e: DocumentAskPasswordEvent): void;
    }>;
}
declare module "loader/CompletedState" {
    import { type PdfJs } from "types/PdfJs";
    import { LoadingStatus } from "loader/LoadingStatus";
    export class CompletedState extends LoadingStatus {
        doc: PdfJs.PdfDocument;
        constructor(doc: PdfJs.PdfDocument);
    }
}
declare module "loader/LoadError" {
    export interface LoadError {
        message?: string;
        name?: string;
    }
}
declare module "loader/FailureState" {
    import { LoadError } from "loader/LoadError";
    import { LoadingStatus } from "loader/LoadingStatus";
    export class FailureState extends LoadingStatus {
        error: LoadError;
        constructor(error: LoadError);
    }
}
declare module "loader/LoadingState" {
    import { LoadingStatus } from "loader/LoadingStatus";
    export class LoadingState extends LoadingStatus {
        percentages: number;
        constructor(percentages: number);
    }
}
declare module "loader/DocumentLoader" {
    import * as React from 'react';
    import { type CharacterMap } from "types/CharacterMap";
    import { type DocumentAskPasswordEvent } from "types/DocumentAskPasswordEvent";
    import { type PdfJs } from "types/PdfJs";
    import { type RenderProtectedView } from "types/RenderProtectedView";
    import { type LoadError } from "loader/LoadError";
    export type RenderError = (error: LoadError) => React.ReactElement;
    export const DocumentLoader: React.FC<{
        characterMap?: CharacterMap;
        file: PdfJs.FileData;
        httpHeaders?: Record<string, string | string[]>;
        render(doc: PdfJs.PdfDocument): React.ReactElement;
        renderError?: RenderError;
        renderLoader?(percentages: number): React.ReactElement;
        renderProtectedView?: RenderProtectedView;
        transformGetDocumentParams?(options: PdfJs.GetDocumentParams): PdfJs.GetDocumentParams;
        withCredentials: boolean;
        onDocumentAskPassword?(e: DocumentAskPasswordEvent): void;
    }>;
}
declare module "portal/StackContext" {
    import * as React from 'react';
    export const StackContext: React.Context<{
        currentIndex: number;
        decreaseNumStacks: () => void;
        increaseNumStacks: () => void;
        numStacks: number;
    }>;
}
declare module "structs/Breakpoint" {
    export enum Breakpoint {
        ExtraSmall = "ExtraSmall",
        Small = "Small",
        Medium = "Medium",
        Large = "Large",
        ExtraLarge = "ExtraLarge"
    }
}
declare module "responsive/BreakpointContext" {
    import * as React from 'react';
    import { Breakpoint } from "structs/Breakpoint";
    export const BreakpointContext: React.Context<Breakpoint>;
}
declare module "responsive/determineBreakpoint" {
    import { Breakpoint } from "structs/Breakpoint";
    export const determineBreakpoint: (width: number) => Breakpoint;
}
declare module "responsive/useBreakpoint" {
    import * as React from 'react';
    import { Breakpoint } from "structs/Breakpoint";
    export const useBreakpoint: () => [React.RefCallback<HTMLElement>, Breakpoint];
}
declare module "utils/isSameUrl" {
    import { type PdfJs } from "types/PdfJs";
    export const isSameUrl: (a: PdfJs.FileData, b: PdfJs.FileData) => boolean;
}
declare module "utils/mergeRefs" {
    import * as React from 'react';
    export const mergeRefs: <T>(refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | null>) => React.RefCallback<T>;
}
declare module "Viewer" {
    import * as React from 'react';
    import { RenderError } from "loader/DocumentLoader";
    import { ScrollMode } from "structs/ScrollMode";
    import { SpecialZoomLevel } from "structs/SpecialZoomLevel";
    import { ViewMode } from "structs/ViewMode";
    import { type CharacterMap } from "types/CharacterMap";
    import { type DocumentAskPasswordEvent } from "types/DocumentAskPasswordEvent";
    import { type DocumentLoadEvent } from "types/DocumentLoadEvent";
    import { type PageChangeEvent } from "types/PageChangeEvent";
    import { type PageLayout } from "types/PageLayout";
    import { type PdfJs } from "types/PdfJs";
    import { type Plugin } from "types/Plugin";
    import { type RenderPage } from "types/RenderPage";
    import { type RenderProtectedView } from "types/RenderProtectedView";
    import { type RotateEvent } from "types/RotateEvent";
    import { type RotatePageEvent } from "types/RotatePageEvent";
    import { type SetRenderRange } from "types/SetRenderRange";
    import { type ZoomEvent } from "types/ZoomEvent";
    export const Viewer: React.FC<{
        characterMap?: CharacterMap;
        defaultScale?: number | SpecialZoomLevel;
        enableSmoothScroll?: boolean;
        fileUrl: string | Uint8Array;
        httpHeaders?: Record<string, string | string[]>;
        initialPage?: number;
        initialRotation?: number;
        pageLayout?: PageLayout;
        plugins?: Plugin[];
        renderError?: RenderError;
        renderLoader?(percentages: number): React.ReactElement;
        renderPage?: RenderPage;
        renderProtectedView?: RenderProtectedView;
        scrollMode?: ScrollMode;
        setRenderRange?: SetRenderRange;
        transformGetDocumentParams?(options: PdfJs.GetDocumentParams): PdfJs.GetDocumentParams;
        viewMode?: ViewMode;
        withCredentials?: boolean;
        onDocumentAskPassword?(e: DocumentAskPasswordEvent): void;
        onDocumentLoad?(e: DocumentLoadEvent): void;
        onPageChange?(e: PageChangeEvent): void;
        onRotate?(e: RotateEvent): void;
        onRotatePage?(e: RotatePageEvent): void;
        onSwitchTheme?(theme: string): void;
        onZoom?(e: ZoomEvent): void;
    }>;
}
declare module "components/Button" {
    import * as React from 'react';
    export const Button: React.FC<{
        children?: React.ReactNode;
        testId?: string;
        onClick(): void;
    }>;
}
declare module "components/LazyRender" {
    import * as React from 'react';
    export const LazyRender: React.FC<{
        attrs?: React.HTMLAttributes<HTMLDivElement>;
        children?: React.ReactNode;
        testId?: string;
    }>;
}
declare module "components/Menu" {
    import * as React from 'react';
    export const Menu: React.FC<{
        children?: React.ReactNode;
    }>;
}
declare module "components/MenuDivider" {
    import * as React from 'react';
    export const MenuDivider: React.FC;
}
declare module "components/MenuItem" {
    import * as React from 'react';
    export const MenuItem: React.FC<{
        checked?: boolean;
        children?: React.ReactNode;
        icon?: React.ReactElement;
        isDisabled?: boolean;
        testId?: string;
        onClick(): void;
    }>;
}
declare module "components/MinimalButton" {
    import * as React from 'react';
    export const MinimalButton: React.FC<{
        ariaLabel?: string;
        ariaKeyShortcuts?: string;
        children?: React.ReactNode;
        isDisabled?: boolean;
        isSelected?: boolean;
        testId?: string;
        onClick(): void;
    }>;
}
declare module "components/ProgressBar" {
    import * as React from 'react';
    export const ProgressBar: React.FC<{
        progress: number;
    }>;
}
declare module "components/Separator" {
    import * as React from 'react';
    export const Separator: React.FC;
}
declare module "components/Skeleton" {
    import * as React from 'react';
    interface SkeletonProps {
        children: ({ attributes, ref, }: {
            attributes: React.HTMLAttributes<HTMLElement>;
            ref: React.RefCallback<HTMLElement>;
        }) => React.ReactElement;
    }
    export const Skeleton: ({ children }: SkeletonProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}
declare module "icons/ResizeIcon" {
    import * as React from 'react';
    export const ResizeIcon: React.FC;
}
declare module "components/Splitter" {
    import * as React from 'react';
    export interface SplitterSize {
        firstHalfPercentage: number;
        firstHalfSize: number;
        secondHalfPercentage: number;
        secondHalfSize: number;
    }
    export const Splitter: React.FC<{
        constrain?(size: SplitterSize): boolean;
    }>;
}
declare module "utils/uniqueId" {
    export const uniqueId: () => number;
}
declare module "hooks/useLockScroll" {
    export const useLockScroll: () => void;
}
declare module "portal/useClickOutsideStack" {
    import * as React from 'react';
    export const useClickOutsideStack: (closeOnClickOutside: boolean, onClickOutside: () => void) => [React.RefCallback<HTMLElement>];
}
declare module "portal/useEscapeStack" {
    export const useEscapeStack: (handler: () => void) => void;
}
declare module "portal/ModalBody" {
    import * as React from 'react';
    import type { Toggle } from "types/Toggle";
    type RenderChildrenProps = ({ onClose }: {
        onClose: Toggle;
    }) => React.ReactNode;
    export const ModalBody: React.FC<{
        ariaControlsSuffix: string;
        children: RenderChildrenProps;
        closeOnClickOutside: boolean;
        closeOnEscape: boolean;
        onClose: Toggle;
    }>;
}
declare module "portal/Stack" {
    import * as React from 'react';
    export const Stack: React.FC<{
        children: React.ReactNode;
    }>;
}
declare module "portal/Modal" {
    import * as React from 'react';
    import type { Toggle } from "types/Toggle";
    export type RenderContent = (toggle: Toggle) => React.ReactNode;
    export type RenderTarget = (toggle: Toggle, opened: boolean) => React.ReactNode;
    export const Modal: React.FC<{
        ariaControlsSuffix?: string;
        closeOnClickOutside: boolean;
        closeOnEscape: boolean;
        content: RenderContent;
        isOpened?: boolean;
        target?: RenderTarget;
    }>;
}
declare module "structs/Position" {
    export enum Position {
        TopLeft = "TOP_LEFT",
        TopCenter = "TOP_CENTER",
        TopRight = "TOP_RIGHT",
        RightTop = "RIGHT_TOP",
        RightCenter = "RIGHT_CENTER",
        RightBottom = "RIGHT_BOTTOM",
        BottomLeft = "BOTTOM_LEFT",
        BottomCenter = "BOTTOM_CENTER",
        BottomRight = "BOTTOM_RIGHT",
        LeftTop = "LEFT_TOP",
        LeftCenter = "LEFT_CENTER",
        LeftBottom = "LEFT_BOTTOM"
    }
}
declare module "portal/Arrow" {
    import * as React from 'react';
    import { Position } from "structs/Position";
    export const Arrow: React.FC<{
        customClassName?: string;
        position: Position;
    }>;
}
declare module "portal/PopoverBody" {
    import * as React from 'react';
    import { Position } from "structs/Position";
    export const PopoverBody: React.ForwardRefExoticComponent<{
        ariaControlsSuffix: string;
        children?: React.ReactNode;
        closeOnClickOutside: boolean;
        position: Position;
        onClose(): void;
    } & React.RefAttributes<HTMLDivElement>>;
}
declare module "portal/PopoverOverlay" {
    import * as React from 'react';
    export const PopoverOverlay: React.FC<{
        children: React.ReactNode;
        closeOnEscape: boolean;
        onClose(): void;
    }>;
}
declare module "utils/determineBestPosition" {
    import { Position } from "structs/Position";
    export const determineBestPosition: (referenceRect: DOMRect, targetRect: DOMRect, containerRect: DOMRect, position: Position, offset: number) => {
        position: Position;
        rect?: DOMRect;
    };
}
declare module "portal/Portal" {
    import * as React from 'react';
    import { Position } from "structs/Position";
    export const Portal: React.FC<{
        children: ({ position, ref }: {
            position: Position;
            ref: React.RefCallback<HTMLElement>;
        }) => React.ReactNode;
        offset?: number;
        position: Position;
        referenceRef: React.RefObject<HTMLElement>;
    }>;
}
declare module "portal/Popover" {
    import * as React from 'react';
    import { Position } from "structs/Position";
    import type { Toggle } from "types/Toggle";
    export type RenderContent = (toggle: Toggle) => React.ReactNode;
    export type RenderTarget = (toggle: Toggle, opened: boolean) => React.ReactNode;
    export const Popover: React.FC<{
        ariaControlsSuffix?: string;
        ariaHasPopup?: 'dialog' | 'menu';
        closeOnClickOutside: boolean;
        closeOnEscape: boolean;
        content: RenderContent;
        lockScroll?: boolean;
        position: Position;
        target: RenderTarget;
    }>;
}
declare module "portal/TooltipBody" {
    import * as React from 'react';
    import { Position } from "structs/Position";
    export const TooltipBody: React.ForwardRefExoticComponent<{
        ariaControlsSuffix: string;
        children?: React.ReactNode;
        closeOnEscape: boolean;
        position: Position;
        onClose(): void;
    } & React.RefAttributes<HTMLDivElement>>;
}
declare module "portal/Tooltip" {
    import * as React from 'react';
    import { Position } from "structs/Position";
    type RenderTooltipContent = () => React.ReactNode;
    export const Tooltip: React.FC<{
        ariaControlsSuffix?: string;
        content: RenderTooltipContent;
        position: Position;
        target: React.ReactElement;
    }>;
}
declare module "types/Store" {
    export type StoreState = Record<string, any>;
    export type StoreKey<T extends StoreState> = string & keyof T;
    export type StoreHandler<T> = (params: T) => void;
    export interface Store<T extends StoreState> {
        subscribe<K extends StoreKey<T>>(eventName: K, handler: StoreHandler<NonNullable<T[K]>>): void;
        unsubscribe<K extends StoreKey<T>>(eventName: K, handler: StoreHandler<NonNullable<T[K]>>): void;
        update<K extends StoreKey<T>>(eventName: K, params: T[K]): void;
        updateCurrentValue<K extends StoreKey<T>>(eventName: K, updater: (currentValue: T[K]) => T[K]): void;
        get<K extends StoreKey<T>>(eventName: K): T[K] | undefined;
    }
}
declare module "store/createStore" {
    import { type Store, type StoreState } from "types/Store";
    export function createStore<T extends StoreState>(initialState?: T): Store<T>;
}
declare module "types/index" {
    export * from "types/CharacterMap";
    export * from "types/Destination";
    export * from "types/DocumentAskPasswordEvent";
    export * from "types/DocumentLoadEvent";
    export * from "types/LocalizationMap";
    export * from "types/Offset";
    export * from "types/OpenFile";
    export * from "types/PageChangeEvent";
    export * from "types/PageLayout";
    export * from "types/PageSize";
    export * from "types/PdfJs";
    export * from "types/PdfJsApiProvider";
    export * from "types/Plugin";
    export * from "types/PluginFunctions";
    export * from "types/Rect";
    export * from "types/RenderPage";
    export * from "types/RenderProtectedView";
    export * from "types/RenderViewer";
    export * from "types/RotateEvent";
    export * from "types/RotatePageEvent";
    export * from "types/SetRenderRange";
    export * from "types/Slot";
    export * from "types/Store";
    export * from "types/Theme";
    export * from "types/Toggle";
    export * from "types/ViewerState";
    export * from "types/VisibilityChanged";
    export * from "types/ZoomEvent";
}
declare module "utils/isMac" {
    export const isMac: () => boolean;
}
declare module "utils/randomNumber" {
    export const randomNumber: (min: number, max: number) => number;
}
declare module "index" {
    export { AnnotationType } from "annotations/AnnotationType";
    export { Button } from "components/Button";
    export { LazyRender } from "components/LazyRender";
    export { Menu } from "components/Menu";
    export { MenuDivider } from "components/MenuDivider";
    export { MenuItem } from "components/MenuItem";
    export { MinimalButton } from "components/MinimalButton";
    export { PrimaryButton } from "components/PrimaryButton";
    export { ProgressBar } from "components/ProgressBar";
    export { Separator } from "components/Separator";
    export { Skeleton } from "components/Skeleton";
    export { Spinner } from "components/Spinner";
    export { Splitter, type SplitterSize } from "components/Splitter";
    export { TextBox } from "components/TextBox";
    export { isFullScreenEnabled } from "fullscreen/fullScreen";
    export { useDebounceCallback } from "hooks/useDebounceCallback";
    export { useIntersectionObserver } from "hooks/useIntersectionObserver";
    export { useIsMounted } from "hooks/useIsMounted";
    export { useIsomorphicLayoutEffect } from "hooks/useIsomorphicLayoutEffect";
    export { usePrevious } from "hooks/usePrevious";
    export { useRenderQueue, type UseRenderQueue } from "hooks/useRenderQueue";
    export { useSafeState } from "hooks/useSafeState";
    export { Icon } from "icons/Icon";
    export { LocalizationContext } from "localization/LocalizationContext";
    export { Modal } from "portal/Modal";
    export { Popover } from "portal/Popover";
    export { Tooltip } from "portal/Tooltip";
    export { Provider } from "Provider";
    export { BreakpointContext } from "responsive/BreakpointContext";
    export { createStore } from "store/createStore";
    export { Breakpoint } from "structs/Breakpoint";
    export { FullScreenMode } from "structs/FullScreenMode";
    export { LayerRenderStatus } from "structs/LayerRenderStatus";
    export { PageMode } from "structs/PageMode";
    export { PasswordStatus } from "structs/PasswordStatus";
    export { Position } from "structs/Position";
    export { RotateDirection } from "structs/RotateDirection";
    export { ScrollMode } from "structs/ScrollMode";
    export { SpecialZoomLevel } from "structs/SpecialZoomLevel";
    export { ToggleStatus } from "structs/ToggleStatus";
    export { ViewMode } from "structs/ViewMode";
    export { DARK_THEME } from "theme/darkTheme";
    export { LIGHT_THEME } from "theme/lightTheme";
    export { TextDirection, ThemeContext } from "theme/ThemeContext";
    export * from "types/index";
    export { chunk } from "utils/chunk";
    export { classNames } from "utils/classNames";
    export { isMac } from "utils/isMac";
    export { getDestination, getPage } from "utils/managePages";
    export { mergeRefs } from "utils/mergeRefs";
    export { randomNumber } from "utils/randomNumber";
    export { PdfJsApiContext } from "vendors/PdfJsApiContext";
    export { Viewer } from "Viewer";
}
declare module "hooks/useRafState" {
    import * as React from 'react';
    export const useRafState: <T>(initialState: T | (() => T)) => [T, React.Dispatch<React.SetStateAction<T>>];
}
declare module "hooks/useRunOnce" {
    export const useRunOnce: (cb: () => void, condition: boolean) => void;
}
declare module "utils/maxByKey" {
    export const maxByKey: <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K) => T;
}
