import { isInPeriod } from '@/utils/helpers';

export const filterOrganizations = (selectedFacets, organizations) => {
  return organizations.filter(organization => {
    let isSelectedOrganizationName = true;
    let isSelectedOrganizationType = true;
    if (selectedFacets) {
      // Is selected organization name
      if (selectedFacets.organizationName && selectedFacets.organizationName.length){
        isSelectedOrganizationName = selectedFacets.organizationName.filter(
          organizationNameFacetId => {
            return organization.id === organizationNameFacetId;
          }
        ).length;
      }
      // Is selected organization type
      if (selectedFacets.organizationType && selectedFacets.organizationType.length){
        isSelectedOrganizationType = selectedFacets.organizationType.filter(
          organizationTypeFacetId => {
            return organization.type === organizationTypeFacetId;
          }
        ).length;
      }
    }
    return isSelectedOrganizationName && isSelectedOrganizationType;
  }
  );
};

export const filterArkadeClients = (selectedFacets, arkadeClients) => {
  return arkadeClients.filter(arkadeClient => {
    let isSelectedOperatingSystem = true;
    let isSelectedUserInterface = true;
    let isSelectedVersion = true;
    if (selectedFacets) {
      // Is selected operating system
      if (selectedFacets.operatingSystem && selectedFacets.operatingSystem.length) {
        isSelectedOperatingSystem = selectedFacets.operatingSystem.filter(
          operatingSystemFacetId => {
            return arkadeClient.operatingSystem === operatingSystemFacetId;
          }
        ).length;
      }
      // Is selected user interface
      if (selectedFacets.userInterface && selectedFacets.userInterface.length) {
        isSelectedUserInterface = selectedFacets.userInterface.filter(
          userInterfaceFacetId => {
            return arkadeClient.userInterface === userInterfaceFacetId;
          }
        ).length;
      }
      // Is selected version
      if (selectedFacets.version && selectedFacets.version.length) {
        isSelectedVersion = selectedFacets.version.filter(
          versionFacetId => {
            return arkadeClient.version === versionFacetId;
          }
        ).length;
      }
    }
    return isSelectedOperatingSystem && isSelectedUserInterface && isSelectedVersion;
  });
};

export const filterProcessingSessions = (selectedFacets, processingSessions) => {
  return processingSessions.filter(processingSession => {
    let isSelectedTime = true;
    let isSelectedArchiveSource = true;
    let isSelectedArchiveType = true;
    if (selectedFacets) {
      // Is selected time
      if (selectedFacets.period) {
        isSelectedTime = isInPeriod(selectedFacets.period.startDate, selectedFacets.period.endDate, processingSession.time);
      }
      // Is selected archive source
      if (selectedFacets.archiveSource && selectedFacets.archiveSource.length) {
        isSelectedArchiveSource = selectedFacets.archiveSource.filter(
          archiveSourceFacetId => {
            return processingSession.archiveSource === archiveSourceFacetId;
          }
        ).length;
      }
      // Is selected archive type
      if (selectedFacets.archiveType && selectedFacets.archiveType.length) {
        isSelectedArchiveType = selectedFacets.archiveType.filter(
          archiveTypeFacetId => {
            return processingSession.archiveType === archiveTypeFacetId;
          }
        ).length;
      }
    }

    return isSelectedTime && isSelectedArchiveSource && isSelectedArchiveType;
  });
};
