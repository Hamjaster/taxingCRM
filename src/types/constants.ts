import { Folder } from ".";

export const mockFolders: Folder[] = [
  {
    id: "1",
    name: "Tax on Track file",
    createdAt: "01/02/25",
    documents: [
      {
        id: "1",
        name: "Contract September",
        type: "pdf",
        createdAt: "01/02/25",
      },
      { id: "2", name: "Contract October", type: "pdf", createdAt: "01/02/25" },
      { id: "3", name: "Image file", type: "image", createdAt: "01/02/25" },
      { id: "4", name: "Image file", type: "image", createdAt: "01/02/25" },
    ],
  },
  {
    id: "2",
    name: "2022",
    createdAt: "01/02/25",
    documents: [
      { id: "5", name: "Tax Return 2022", type: "pdf", createdAt: "01/02/25" },
      { id: "6", name: "W2 Forms", type: "pdf", createdAt: "01/02/25" },
    ],
  },
  {
    id: "3",
    name: "2023",
    createdAt: "01/02/25",
    documents: [
      { id: "7", name: "Tax Return 2023", type: "pdf", createdAt: "01/02/25" },
      { id: "8", name: "1099 Forms", type: "pdf", createdAt: "01/02/25" },
    ],
  },
  {
    id: "4",
    name: "2024",
    createdAt: "01/02/25",
    documents: [
      { id: "9", name: "Q1 Reports", type: "pdf", createdAt: "01/02/25" },
      { id: "10", name: "Q2 Reports", type: "pdf", createdAt: "01/02/25" },
    ],
  },
  {
    id: "5",
    name: "2025",
    createdAt: "01/02/25",
    documents: [
      {
        id: "11",
        name: "Planning Documents",
        type: "doc",
        createdAt: "01/02/25",
      },
    ],
  },
  {
    id: "6",
    name: "2021",
    createdAt: "01/02/25",
    documents: [
      { id: "12", name: "Archive Files", type: "pdf", createdAt: "01/02/25" },
    ],
  },
];
