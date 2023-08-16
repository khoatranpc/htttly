--import extension
create extension postgis;

--input table data from csv file
COPY data
FROM 'E:\OneDrive - 3S-Team-O365\1_He thong tin dia ly\BTL\Book1.csv'
DELIMITER ','
CSV HEADER;

SELECT * FROM data;
--create view gadm_hcm_2
-- lay du lieu quan/huyen HCM tu gadm41_vnm_2

DROP VIEW gadm_hcm_2
CREATE OR REPLACE VIEW gadm_hcm_2 AS
SELECT gadm41_vnm_2.gid,
    gadm41_vnm_2.gid_2,
    gadm41_vnm_2.gid_0,
    gadm41_vnm_2.country,
    gadm41_vnm_2.gid_1,
    gadm41_vnm_2.name_1,
    gadm41_vnm_2.nl_name_1,
    gadm41_vnm_2.name_2,
    gadm41_vnm_2.varname_2,
    gadm41_vnm_2.nl_name_2,
    gadm41_vnm_2.type_2,
    gadm41_vnm_2.engtype_2,
    gadm41_vnm_2.cc_2,
    gadm41_vnm_2.hasc_2,
    gadm41_vnm_2.geom,
    data.danso,
    data.dientich,
    data.soluong
   FROM gadm41_vnm_2, data
  WHERE gadm41_vnm_2.gid_2 = data.gid_2
  AND gadm41_vnm_2.gid_1::text = 'VNM.25_1'::text;

DROP VIEW gadm_hcm_3
--create view gadm_hcm_3
-- lay du lieu xa/phuong HCM tu gadm41_vnm_3
CREATE OR REPLACE VIEW gadm_hcm_3 AS
SELECT gadm41_vnm_3.gid,
    gadm41_vnm_3.gid_3,
    gadm41_vnm_3.gid_0,
    gadm41_vnm_3.country,
    gadm41_vnm_3.gid_1,
    gadm41_vnm_3.name_1,
    gadm41_vnm_3.nl_name_1,
    gadm41_vnm_3.gid_2,
    gadm41_vnm_3.name_2,
    gadm41_vnm_3.nl_name_2,
    gadm41_vnm_3.name_3,
    gadm41_vnm_3.varname_3,
    gadm41_vnm_3.nl_name_3,
    gadm41_vnm_3.type_3,
    gadm41_vnm_3.engtype_3,
    gadm41_vnm_3.cc_3,
    gadm41_vnm_3.hasc_3,
    gadm41_vnm_3.geom
   FROM gadm41_vnm_3
  WHERE gadm41_vnm_3.gid_1::text = 'VNM.25_1'::text;
  
--show data gadm_hcm_2
SELECT gadm_hcm_2.gid,
    gadm_hcm_2.gid_2,
    gadm_hcm_2.gid_0,
    gadm_hcm_2.country,
    gadm_hcm_2.gid_1,
    gadm_hcm_2.name_1,
    gadm_hcm_2.nl_name_1,
    gadm_hcm_2.name_2,
    gadm_hcm_2.varname_2,
    gadm_hcm_2.nl_name_2,
    gadm_hcm_2.type_2,
    gadm_hcm_2.engtype_2,
    gadm_hcm_2.cc_2,
    gadm_hcm_2.hasc_2,
    gadm_hcm_2.geom,
    data.danso,
    data.dientich,
    data.soluong
   FROM gadm_hcm_2 JOIN data ON gadm_hcm_2.gid_2::text = data.gid_2::text;
