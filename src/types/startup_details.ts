export type startup_details = {
  startup_logo: string;
  startup_name: string;
  startup_description: string;
  startup_website: string;
  startup_industry: string;
  startup_country: string;
  startup_investors: [
    {
      id: string;
      name: string;
    }
  ];
};
