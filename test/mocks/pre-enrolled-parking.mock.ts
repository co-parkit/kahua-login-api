export const mockEnrolledParkingModel = {
  create: jest.fn().mockImplementation((data) => ({
    ...data,
    legal_representative: data.legal_representative || 'MockRep',
    company_name: data.company_name || 'MockCompany',
    external_id: data.external_id || 'mock-external-id',
    internal_id: data.internal_id || null,
  })),
};
