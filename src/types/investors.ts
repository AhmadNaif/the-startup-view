export type Investors = {
  investor_logo: string;
  investor_name: string;
  investor_description: string;
  investor_website: string;
  investor_startups: [
    {
      id: string;
      name: string;
    }
  ];
};
