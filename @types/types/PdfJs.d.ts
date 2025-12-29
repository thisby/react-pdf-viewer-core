import { PageMode } from '../structs/PageMode';
export declare namespace PdfJs {
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
