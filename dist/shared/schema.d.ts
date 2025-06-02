import { z } from 'zod';
export declare const preorders: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "preorders";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "preorders";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        name: import("drizzle-orm/pg-core").PgColumn<{
            name: "name";
            tableName: "preorders";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        email: import("drizzle-orm/pg-core").PgColumn<{
            name: "email";
            tableName: "preorders";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        preferredScent: import("drizzle-orm/pg-core").PgColumn<{
            name: "preferred_scent";
            tableName: "preorders";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        phone: import("drizzle-orm/pg-core").PgColumn<{
            name: "phone";
            tableName: "preorders";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        address: import("drizzle-orm/pg-core").PgColumn<{
            name: "address";
            tableName: "preorders";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        newsletter: import("drizzle-orm/pg-core").PgColumn<{
            name: "newsletter";
            tableName: "preorders";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        discountCode: import("drizzle-orm/pg-core").PgColumn<{
            name: "discount_code";
            tableName: "preorders";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "preorders";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const insertPreorderSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    email: z.ZodString;
    preferredScent: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    newsletter: z.ZodOptional<z.ZodNullable<z.ZodDefault<z.ZodBoolean>>>;
    discountCode: z.ZodString;
    createdAt: z.ZodOptional<z.ZodDate>;
}, "id" | "discountCode" | "createdAt">, z.UnknownKeysParam, z.ZodTypeAny, {
    name: string;
    email: string;
    preferredScent?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    newsletter?: boolean | null | undefined;
}, {
    name: string;
    email: string;
    preferredScent?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    newsletter?: boolean | null | undefined;
}>;
export declare const selectPreorderSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    email: z.ZodString;
    preferredScent: z.ZodNullable<z.ZodString>;
    phone: z.ZodNullable<z.ZodString>;
    address: z.ZodNullable<z.ZodString>;
    newsletter: z.ZodNullable<z.ZodBoolean>;
    discountCode: z.ZodString;
    createdAt: z.ZodDate;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id: number;
    name: string;
    email: string;
    preferredScent: string | null;
    phone: string | null;
    address: string | null;
    newsletter: boolean | null;
    discountCode: string;
    createdAt: Date;
}, {
    id: number;
    name: string;
    email: string;
    preferredScent: string | null;
    phone: string | null;
    address: string | null;
    newsletter: boolean | null;
    discountCode: string;
    createdAt: Date;
}>;
export type InsertPreorder = z.infer<typeof insertPreorderSchema>;
export type Preorder = typeof preorders.$inferSelect;
//# sourceMappingURL=schema.d.ts.map