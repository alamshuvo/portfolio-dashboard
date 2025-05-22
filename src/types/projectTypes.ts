export type TProject = {
    _id?: string; // Optional, for edit mode or database ID
    projectsName: string;
    liveLink: string;
    githubFrontendLink: string;
    githubBackendLink: string;
    projectPhoto: string;
    backendLiveLink: string;
    description: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  