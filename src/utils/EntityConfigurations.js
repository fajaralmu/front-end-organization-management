export const divisionConfig = {
    title: "Badan Pengurus",
    entityName: "division",
    disabled: true,
    id: "id",
    fieldNames: [
        { name: "name", lableName: "Nama" },
        { name: "description" }, { name: "institution.name" }
    ],
    formData: [
        {
            lableName: "Nama BPD",
            inputType: "text",
            name: "name"
        },

        {
            lableName: "Deskripsi BPD",
            inputType: "textarea",
            name: "description"
        },
        {
            lableName: "Division Insitusi",
            inputType: "dynamicDropdown",
            name: "institution.name",
            reffEntity: "Institution",
            idField: "id",
            displayField: "name"
        }
    ]
}

export const sectionConfig = {
    title: "Divisi",
    entityName: "section",
    id: "id",
    fieldNames: [
        { name: "name" },
        { name: "division.name" }
    ],
    formData: [
        {
            lableName: "Nama Divisi",
            inputType: "text",
            name: "name"
        },

        {
            lableName: "BPD",
            inputType: "dynamicDropdown",
            name: "division.name",
            reffEntity: "division",
            idField: "id",
            displayField: "name"
        }
    ]
}

export const programConfig = {
    title: "Program Kerja",
    entityName: "program",
    id: "id",
    fieldNames: [
        { name: "name" },
        { name: "description" }
        ,
        { name: "section.name" }
    ],
    formData: [
        {
            lableName: "Nama Proker",
            inputType: "text",
            name: "name"
        },
        {
            lableName: "Deskripsi Proker",
            inputType: "textarea",
            name: "description"
        },
        {
            lableName: "Nama Divisi",
            inputType: "dynamicDropdown",
            name: "section.name",
            reffEntity: "section",
            idField: "id",
            displayField: "name"
        }
    ]
}

const eventStatus =  [
    { text: "-Not Configured-", value: -1 },
    { text: "Done", value: 1 },
    { text: "UnDone", value: 0 }
];

export const eventConfig = {
    title: "Kegiatan",
    entityName: "event",
    id: "id",
    fieldNames: [
        { name: "name" },
        { name: "info" },
        { name: "date", type: "longDate" },
        { name: "location" },
        { name: "program.name" },
        { name: "participant" },
        {
            name: "done", type: "staticDropdown", options:eventStatus
        }
    ],
    formData: [
        {
            lableName: "Nama Kegiatan",
            inputType: "text",
            name: "name"
        },
        {
            lableName: "Waktu Kegiatan",
            inputType: "date",
            name: "date"
        },
        {
            lableName: "Info Kegiatan",
            inputType: "textarea",
            name: "info"
        }, {
            lableName: "Lokasi Kegiatan",
            inputType: "text",
            name: "location"
        },
        {
            lableName: "Nama Program",
            inputType: "dynamicDropdown",
            name: "program.name",
            reffEntity: "program",
            idField: "id",
            displayField: "name"
        },
        {
            lableName: "Status Kegiatan",
            inputType: "staticDropDown",
            name: "done",
            options:eventStatus
        },
        {
            lableName: "Peserta",
            inputType: "number",
            name: "participant"
        },
    ]
}

export const positionConfig = {
    title: "Posisi",
    entityName: "position",
    id: "id",
    disabled: true,
    fieldNames: [
        { name: "name" },
        { name: "description" },

    ],
    formData: [
        {
            lableName: "Nama Posisi",
            inputType: "text",
            name: "name"
        },
        {
            lableName: "Deskripsi",
            inputType: "textarea",
            name: "description"
        },

    ]
}


export const memberConfig = {
    title: "Anggota",
    entityName: "member",
    id: "id",
    fieldNames: [
        { name: "name" },
        { name: "position.name" },
        { name: "section.name" },
        { name: "description.name" }

    ],
    formData: [
        {
            lableName: "Nama Anggota",
            inputType: "text",
            name: "name"
        },
        {
            lableName: "Nama Posisi",
            inputType: "dynamicDropdown",
            name: "position.name",
            reffEntity: "position",
            idField: "id",
            displayField: "name"
        },
        {
            lableName: "Nama Divisi",
            inputType: "dynamicDropdown",
            name: "section.name",
            reffEntity: "section",
            idField: "id",
            displayField: "name"
        },
        {
            lableName: "Deskripsi",
            inputType: "textarea",
            name: "name"
        },

    ]
}







//==============OLD STUFF==============//

/**
 * SAMPLE
 */

export const productConfig = {
    title: "Product",
    entityName: "product",
    id: "id",
    fieldNames: [
        { name: "name" }, { name: "code" },
        { name: "description" }, { name: "unit.name" },
        { name: "price", type: "number" }, { name: "category.name" },
        { name: "imageUrl", type: "imageMultiple" }
    ],
    formData: [
        {
            lableName: "Product Name",
            inputType: "text",
            name: "name"
        },
        {
            lableName: "Product Code",
            inputType: "text",
            name: "code"
        },
        {
            lableName: "Product Image(s)",
            inputType: "multipleImage",
            name: "imageUrl"
        },
        {
            lableName: "Product Description",
            inputType: "textarea",
            name: "description"
        },
        {
            lableName: "Product Unit",
            inputType: "dynamicDropdown",
            name: "unit.name",
            reffEntity: "Unit",
            idField: "id",
            displayField: "name"
        },
        {
            lableName: "Product Price",
            inputType: "number",
            name: "price"
        },
        {
            lableName: "Product Category",
            inputType: "dynamicDropdown",
            name: "category.name",
            reffEntity: "Category",
            idField: "id",
            displayField: "name"
        }
    ]
}


export const supplierList = {
    title: "Supplier",
    entityName: "supplier",
    id: "id",
    fieldNames: [
        { name: "name" }, { name: "address" }, { name: "contact" }, { name: "website", type: "link" },
        { name: "iconUrl", type: "image" }
    ],
    formData: [
        {
            lableName: "Supplier Name",
            inputType: "text",
            name: "name"
        },
        {
            lableName: "Supplier Address",
            inputType: "textarea",
            name: "address"
        },
        {
            lableName: "Supplier Contact",
            inputType: "text",
            name: "contact"
        },
        {
            lableName: "Supplier Icon",
            inputType: "singleImage",
            name: "iconUrl"
        },
        {
            lableName: "Supplier Website",
            inputType: "text",
            name: "website"
        }
    ]
}
export const customerList = {
    title: "Customer",
    entityName: "customer",
    id: "id",
    fieldNames: [
        { name: "username" }, { name: "name" }, { name: "address" }, { name: "phone" }, { name: "email" }
    ],
    formData: [
        {
            lableName: "Customer Unique Name",
            inputType: "text",
            name: "username"
        },
        {
            lableName: "Customer Name",
            inputType: "text",
            name: "name"
        },
        {
            lableName: "Customer Address",
            inputType: "textarea",
            name: "address"
        },
        {
            lableName: "Customer Phone",
            inputType: "text",
            name: "phone"
        },
        {
            lableName: "Customer Email",
            inputType: "email",
            name: "email"
        }
    ]
}

export const transactionConfig = {
    title: "Transaction",
    entityName: "transaction",
    disabled: true,
    id: "id",
    fieldNames: [
        { name: "code" }, { name: "transactionDate", type: "longDate" },
        { name: "type" }, { name: "supplier.name" },
        { name: "customer.name" }
    ],
    formData: [
        {
            lableName: "Transaction Code",
            inputType: "text",
            name: "code"
        },
        {
            lableName: "Date",
            inputType: "text",
            name: "transactionDate"
        },
        {
            lableName: "Transaction Type",
            inputType: "text",
            name: "type"
        },
        {
            lableName: "Supplier",
            inputType: "text",
            name: "supplier.name"
        },
        {
            lableName: "Customer",
            inputType: "text",
            name: "customer.name",
        },

    ]
}