export const mockEnrolledParkingModel = {
  create: jest.fn().mockImplementation((data) => ({
    ...data,
    legalRepresentative: data.legalRepresentative || 'MockRep',
    companyName: data.companyName || 'MockCompany',
    externalId: data.externalId || 'mock-external-id',
    internalId: data.internalId || null,
  })),
  save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
};
