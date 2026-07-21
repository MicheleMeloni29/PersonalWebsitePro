// Describes a single media item used in a project gallery.
export interface ProjectImage {
    // Defaults to a regular image when omitted.
    type?: "image" | "video";
    // Relative or absolute path to the media asset.
    src: string;
}

// Represents an external resource related to a project.
export interface ProjectLink {
    // Text shown to the user for the link.
    label: string;
    // Destination URL for the resource.
    url: string;
}

export type ProjectKind = "app" | "website";

// Defines the full data shape required to render a project entry.
export interface Project {
    // Distinguishes apps from websites so the card can render the right layout.
    kind: ProjectKind;
    // Project name shown in cards and detail views.
    title: string;
    // Hero image used as the card background when available.
    coverImage?: string;
    // Main technologies shown as compact chips on the card.
    stack: string[];
    // Short summary used in compact UI sections.
    short: string;
    // Full description used when expanded or displayed in detail.
    full: string;
    // Gallery items can be plain image paths or explicit media objects.
    images: (string | ProjectImage)[];
    // Optional list of related links such as demos or repositories.
    links?: ProjectLink[];
}
