export const TYPE_DYNAMIC_DROPDOWN  = "dynamicDropdown";
export const TYPE_TEXTAREA = "textarea";

export const TYPE_LONG_DATE = "longDate";
export const TYPE_STATIC_DROPDOWN = "staticDropdown";
export const TYPE_NUMBER = "number";
export const TYPE_TEXT = "text";

export const TYPE_MULTIPLE_IMAGE = "multipleImage";
export const TYPE_SINGLE_IMAGE = "singleImage";

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
            inputType: TYPE_TEXT,
            name: "name"
        },

        {
            lableName: "Deskripsi BPD",
            inputType: TYPE_TEXTAREA,
            name: "description"
        },
        {
            lableName: "Division Insitusi",
            inputType: TYPE_DYNAMIC_DROPDOWN,
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
            inputType: TYPE_TEXT,
            name: "name"
        },

        {
            lableName: "BPD",
            inputType: TYPE_DYNAMIC_DROPDOWN,
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
            inputType: TYPE_TEXT,
            name: "name"
        },
        {
            lableName: "Deskripsi Proker",
            inputType: TYPE_TEXTAREA,
            name: "description"
        },
        {
            lableName: "Nama Divisi",
            inputType: TYPE_DYNAMIC_DROPDOWN,
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
        { name: "date", type: TYPE_LONG_DATE },
        { name: "location" },
        { name: "program.name" },
        { name: "participant" },
        {
            name: "done", type: TYPE_STATIC_DROPDOWN, options:eventStatus
        }
    ],
    formData: [
        {
            lableName: "Nama Kegiatan",
            inputType: TYPE_TEXT,
            name: "name"
        },
        {
            lableName: "Waktu Kegiatan",
            inputType: "date",
            name: "date"
        },
        {
            lableName: "Info Kegiatan",
            inputType: TYPE_TEXTAREA,
            name: "info"
        }, {
            lableName: "Lokasi Kegiatan",
            inputType: TYPE_TEXT,
            name: "location"
        },
        {
            lableName: "Nama Program",
            inputType: TYPE_DYNAMIC_DROPDOWN,
            name: "program.name",
            reffEntity: "program",
            idField: "id",
            displayField: "name"
        },
        {
            lableName: "Status Kegiatan",
            inputType: TYPE_STATIC_DROPDOWN,
            name: "done",
            options:eventStatus
        },
        {
            lableName: "Peserta",
            inputType: TYPE_NUMBER,
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
            inputType: TYPE_TEXT,
            name: "name"
        },
        {
            lableName: "Deskripsi",
            inputType: TYPE_TEXTAREA,
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
            inputType: TYPE_TEXT,
            name: "name"
        },
        {
            lableName: "Nama Posisi",
            inputType: TYPE_DYNAMIC_DROPDOWN,
            name: "position.name",
            reffEntity: "position",
            idField: "id",
            displayField: "name"
        },
        {
            lableName: "Nama Divisi",
            inputType: TYPE_DYNAMIC_DROPDOWN,
            name: "section.name",
            reffEntity: "section",
            idField: "id",
            displayField: "name"
        },
        {
            lableName: "Deskripsi",
            inputType: TYPE_TEXTAREA,
            name: "description"
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
        { name: "price", type: TYPE_NUMBER }, { name: "category.name" },
        { name: "imageUrl", type: "imageMultiple" }
    ],
    formData: [
        {
            lableName: "Product Name",
            inputType: TYPE_TEXT,
            name: "name"
        },
        {
            lableName: "Product Code",
            inputType: TYPE_TEXT,
            name: "code"
        },
        {
            lableName: "Product Image(s)",
            inputType: "multipleImage",
            name: "imageUrl"
        },
        {
            lableName: "Product Description",
            inputType: TYPE_TEXTAREA,
            name: "description"
        },
        {
            lableName: "Product Unit",
            inputType: TYPE_DYNAMIC_DROPDOWN,
            name: "unit.name",
            reffEntity: "Unit",
            idField: "id",
            displayField: "name"
        },
        {
            lableName: "Product Price",
            inputType: TYPE_NUMBER,
            name: "price"
        },
        {
            lableName: "Product Category",
            inputType: TYPE_DYNAMIC_DROPDOWN,
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
            inputType: TYPE_TEXT,
            name: "name"
        },
        {
            lableName: "Supplier Address",
            inputType: TYPE_TEXTAREA,
            name: "address"
        },
        {
            lableName: "Supplier Contact",
            inputType: TYPE_TEXT,
            name: "contact"
        },
        {
            lableName: "Supplier Icon",
            inputType: "singleImage",
            name: "iconUrl"
        },
        {
            lableName: "Supplier Website",
            inputType: TYPE_TEXT,
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
            inputType: TYPE_TEXT,
            name: "username"
        },
        {
            lableName: "Customer Name",
            inputType: TYPE_TEXT,
            name: "name"
        },
        {
            lableName: "Customer Address",
            inputType: TYPE_TEXTAREA,
            name: "address"
        },
        {
            lableName: "Customer Phone",
            inputType: TYPE_TEXT,
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
        { name: "code" }, { name: "transactionDate", type: TYPE_LONG_DATE },
        { name: "type" }, { name: "supplier.name" },
        { name: "customer.name" }
    ],
    formData: [
        {
            lableName: "Transaction Code",
            inputType: TYPE_TEXT,
            name: "code"
        },
        {
            lableName: "Date",
            inputType: TYPE_TEXT,
            name: "transactionDate"
        },
        {
            lableName: "Transaction Type",
            inputType: TYPE_TEXT,
            name: "type"
        },
        {
            lableName: "Supplier",
            inputType: TYPE_TEXT,
            name: "supplier.name"
        },
        {
            lableName: "Customer",
            inputType: TYPE_TEXT,
            name: "customer.name",
        },

    ]
}