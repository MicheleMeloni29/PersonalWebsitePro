export interface ProjectImage {
    type?: "image" | "video";
    src: string;
}

export interface ProjectLink {
    label: string;
    url: string;
}

export interface Project {
    title: string;
    short: string;
    full: string;
    images: (string | ProjectImage)[];
    links?: ProjectLink[];
}
