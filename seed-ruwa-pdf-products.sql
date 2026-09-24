-- Ruwa Biosciences catalogue seed from
-- RUWA BIOSCIENCES LIMITED_260923_144239.pdf
-- Run supabase-products.sql first.
-- All products are live and intentionally have no images.

insert into public.products (
  title, sku, category, manufacturer, short_description, description,
  price, currency, unit_of_sale, pack_size, stock_quantity,
  minimum_order_quantity, request_quote, attributes, product_tags,
  image_urls, is_active
)
select
  seed.title, seed.sku, seed.category, '', seed.short_description, seed.description,
  seed.price::numeric, 'KES', seed.unit_of_sale, seed.pack_size, 0,
  1, false, seed.attributes::jsonb, '{}', '{}', true
from (values
  ('Chlamydia Kits','RDT-CHL-001','RDT kits and reagents','Chlamydia rapid diagnostic test kit.','Rapid diagnostic kit for Chlamydia screening.','4700.00','Pack','25 tests','{"test_name":"Chlamydia","pack_quantity":"25 tests"}'),
  ('Gonorrhea Kits','RDT-GON-001','RDT kits and reagents','Gonorrhea rapid diagnostic test kit.','Rapid diagnostic kit for Gonorrhea screening.','4700.00','Pack','25 tests','{"test_name":"Gonorrhea","pack_quantity":"25 tests"}'),
  ('H. Pylori Ag','RDT-HPY-AG-001','RDT kits and reagents','H. Pylori antigen test kit.','Rapid diagnostic kit for H. Pylori antigen testing.','2500.00','Pack','25 tests','{"test_name":"H. Pylori Ag","pack_quantity":"25 tests"}'),
  ('H. Pylori Ab','RDT-HPY-AB-001','RDT kits and reagents','H. Pylori antibody test kit.','Rapid diagnostic kit for H. Pylori antibody testing.','2500.00','Pack','25 tests','{"test_name":"H. Pylori Ab","pack_quantity":"25 tests"}'),
  ('Salmonella Ag','RDT-SAL-AG-001','RDT kits and reagents','Salmonella antigen test kit.','Rapid diagnostic kit for Salmonella antigen testing.','2600.00','Pack','25 tests','{"test_name":"Salmonella Ag","pack_quantity":"25 tests"}'),
  ('Salmonella Ab','RDT-SAL-AB-001','RDT kits and reagents','Salmonella antibody test kit.','Rapid diagnostic kit for Salmonella antibody testing.','2600.00','Pack','25 tests','{"test_name":"Salmonella Ab","pack_quantity":"25 tests"}'),
  ('Malaria PF/PAN','RDT-MAL-PF-PAN-001','RDT kits and reagents','Malaria PF/PAN rapid diagnostic test kit.','Rapid diagnostic kit for Malaria PF/PAN screening.','1500.00','Pack','25 tests','{"test_name":"Malaria PF/PAN","pack_quantity":"25 tests"}'),
  ('MRDT','RDT-MRDT-001','RDT kits and reagents','Malaria rapid diagnostic test kit.','Rapid malaria diagnostic test kit for point-of-care screening.','1000.00','Pack','25 tests','{"test_name":"MRDT","pack_quantity":"25 tests"}'),
  ('T.B. Cassette','RDT-TB-001','RDT kits and reagents','Tuberculosis cassette test.','Rapid cassette test for tuberculosis screening.','2300.00','Pack','25 tests','{"test_name":"T.B.","pack_quantity":"25 tests"}'),
  ('Urinalysis Strips (10 Para)','RDT-URI-10P-001','RDT kits and reagents','10-parameter urinalysis strips.','Urinalysis strips for multi-parameter urine screening.','800.00','Pack','100 strips','{"test_name":"Urinalysis 10 Para","pack_quantity":"100 strips"}'),
  ('hCG / PDT (Urine)','RDT-HCG-URINE-001','RDT kits and reagents','Urine hCG/PDT test kit.','Rapid urine test kit for hCG screening.','500.00','Pack','50 tests','{"test_name":"hCG / PDT","specimen":"Urine","pack_quantity":"50 tests"}'),
  ('hCG / PDT (Serum)','RDT-HCG-SERUM-001','RDT kits and reagents','Serum hCG/PDT test kit.','Rapid serum test kit for hCG screening.','1300.00','Pack','25 tests','{"test_name":"hCG / PDT","specimen":"Serum","pack_quantity":"25 tests"}'),
  ('VDRL','RDT-VDRL-001','RDT kits and reagents','VDRL test kit.','Diagnostic test kit for VDRL screening.','1200.00','Pack','25 tests','{"test_name":"VDRL","pack_quantity":"25 tests"}'),
  ('Hepatitis B Strips','RDT-HEP-B-001','RDT kits and reagents','Hepatitis B strip test.','Rapid strip test for Hepatitis B screening.','1200.00','Pack','25 tests','{"test_name":"Hepatitis B","pack_quantity":"25 tests"}'),
  ('FOB Pack (Fecal Occult Blood)','RDT-FOB-001','RDT kits and reagents','Fecal occult blood test pack.','Rapid test pack for fecal occult blood screening.','2300.00','Pack','25 tests','{"test_name":"FOB","specimen":"Stool","pack_quantity":"25 tests"}'),
  ('Multidrug Pack','RDT-MULTIDRUG-001','RDT kits and reagents','Multidrug test pack.','Multi-panel rapid diagnostic test pack for screening.','12000.00','Pack','25 tests','{"test_name":"Multidrug","pack_quantity":"25 tests"}'),
  ('PSA Cassette','RDT-PSA-001','RDT kits and reagents','PSA cassette test.','Rapid cassette test for PSA screening.','2300.00','Pack','25 tests','{"test_name":"PSA","pack_quantity":"25 tests"}'),
  ('Brucella Kits','RDT-BRUCELLA-001','RDT kits and reagents','Brucella test kit.','Diagnostic test kit for Brucella screening.','1050.00','Pack','1 pack','{"test_name":"Brucella","pack_quantity":"1 pack"}'),
  ('ASOT Kit','RDT-ASOT-001','RDT kits and reagents','ASOT test kit.','Diagnostic test kit for ASOT screening.','1050.00','Pack','1 pack','{"test_name":"ASOT","pack_quantity":"1 pack"}'),
  ('Sickle Cell Rapid Test','RDT-SICKLE-001','RDT kits and reagents','Sickle cell rapid test kit.','Rapid diagnostic kit for sickle cell screening.','12000.00','Pack','25 tests','{"test_name":"Sickle Cell","pack_quantity":"25 tests"}'),
  ('Rheumatoid Factor','RDT-RF-001','RDT kits and reagents','Rheumatoid factor test kit.','Diagnostic test kit for rheumatoid factor screening.','7500.00','Pack','5 tests','{"test_name":"Rheumatoid Factor","pack_quantity":"5 tests"}'),
  ('Blood Grouping Set','RDT-BLOOD-GROUP-001','RDT kits and reagents','Blood grouping set.','Set for blood group testing and classification.','1500.00','Set','1 set','{"test_name":"Blood Grouping","pack_quantity":"1 set"}'),
  ('Yellow Pipette Tips','LAB-PIPETTE-YELLOW-001','Laboratory consumables and blood collection','Yellow pipette tips.','Laboratory pipette tips for liquid handling.','500.00','Pack','1 pack','{"consumable_type":"Pipette tips","colour":"Yellow","pack_quantity":"1 pack"}'),
  ('Blue Pipette Tips','LAB-PIPETTE-BLUE-001','Laboratory consumables and blood collection','Blue pipette tips.','Laboratory pipette tips for liquid handling.','500.00','Pack','1 pack','{"consumable_type":"Pipette tips","colour":"Blue","pack_quantity":"1 pack"}'),
  ('Red Top Vacutainer Tubes','LAB-VACUTAINER-RED-001','Laboratory consumables and blood collection','Red top vacutainer tubes.','Blood collection tubes with red tops.','9000.00','Pack','100 pieces','{"consumable_type":"Vacutainer tubes","top_colour":"Red","pack_quantity":"100 pieces"}'),
  ('Purple Top Vacutainer Tubes','LAB-VACUTAINER-PURPLE-001','Laboratory consumables and blood collection','Purple top vacutainer tubes.','Blood collection tubes with purple tops.','9000.00','Pack','100 pieces','{"consumable_type":"Vacutainer tubes","top_colour":"Purple","pack_quantity":"100 pieces"}'),
  ('Blood Bags (Single)','LAB-BLOOD-BAG-SINGLE-001','Laboratory consumables and blood collection','Single blood bag.','Single blood collection bag for laboratory and clinical supply.','800.00','Unit','1 piece','{"consumable_type":"Blood bag","configuration":"Single","pack_quantity":"1 piece"}'),
  ('Blood Bags (Double)','LAB-BLOOD-BAG-DOUBLE-001','Laboratory consumables and blood collection','Double blood bag.','Double blood collection bag for laboratory and clinical supply.','1100.00','Unit','1 piece','{"consumable_type":"Blood bag","configuration":"Double","pack_quantity":"1 piece"}'),
  ('Stool Containers','LAB-STOOL-CONTAINER-001','Laboratory consumables and blood collection','Stool specimen container.','Specimen container for stool sample collection.','17.00','Unit','1 piece','{"consumable_type":"Specimen container","specimen":"Stool","pack_quantity":"1 piece"}'),
  ('Sinocare Blood Sugar Machine','POC-SINOCARE-GLUCOSE-001','POC meters and diagnostic equipment','Sinocare blood sugar machine.','Point-of-care blood glucose meter for glucose testing.','700.00','Unit','1 unit','{"equipment_type":"Blood glucose meter","brand":"Sinocare"}'),
  ('Sinocare Glucose Test Strips','POC-SINOCARE-STRIPS-001','POC meters and diagnostic equipment','Sinocare glucose test strips.','Test strips compatible with a Sinocare blood glucose meter.','1200.00','Pack','1 pack','{"equipment_type":"Glucose test strips","brand":"Sinocare"}'),
  ('Mission Hb (Hemoglobin) Machine','POC-MISSION-HB-001','POC meters and diagnostic equipment','Mission Hb machine.','Point-of-care haemoglobin testing machine.','9750.00','Unit','1 unit','{"equipment_type":"Haemoglobin meter","parameter":"Haemoglobin"}'),
  ('Mission Hb Test Strips','POC-MISSION-HB-STRIPS-001','POC meters and diagnostic equipment','Mission Hb test strips.','Test strips for Mission Hb haemoglobin testing equipment.','2900.00','Pack','1 pack','{"equipment_type":"Haemoglobin test strips","compatible_device":"Mission Hb"}'),
  ('Microscope LED','POC-MICROSCOPE-LED-001','POC meters and diagnostic equipment','LED microscope.','LED microscope for laboratory observation and examination.','30000.00','Unit','1 unit','{"equipment_type":"Microscope","lighting":"LED"}'),
  ('Fetal Doppler (JPD 100E)','POC-FETAL-DOPPLER-001','POC meters and diagnostic equipment','JPD 100E fetal doppler.','Fetal doppler device for point-of-care clinical use.','13000.00','Unit','1 unit','{"equipment_type":"Fetal doppler","model":"JPD 100E"}'),
  ('Sinocare BP Machine','POC-SINOCARE-BP-001','POC meters and diagnostic equipment','Sinocare blood pressure machine.','Point-of-care blood pressure measurement machine.','4500.00','Unit','1 unit','{"equipment_type":"Blood pressure machine","brand":"Sinocare"}'),
  ('Immunoassay P.O.C. Machine','POC-IMMUNOASSAY-001','POC meters and diagnostic equipment','Immunoassay point-of-care machine.','Point-of-care machine for immunoassay testing workflows.','150000.00','Unit','1 unit','{"equipment_type":"Immunoassay machine"}'),
  ('Coagulation Machine','POC-COAGULATION-001','POC meters and diagnostic equipment','Coagulation machine.','Laboratory and point-of-care machine for coagulation testing workflows.','120000.00','Unit','1 unit','{"equipment_type":"Coagulation machine"}'),
  ('Ultrasound Machine Mindray DP10 (One Probe)','POC-ULTRASOUND-MINDRAY-DP10-001','POC meters and diagnostic equipment','Mindray DP10 ultrasound machine.','Ultrasound machine supplied with one probe.','550000.00','Unit','1 unit','{"equipment_type":"Ultrasound machine","model":"Mindray DP10","probes":"1"}'),
  ('Sony Ultrasound Printer (Refurbished)','POC-SONY-ULTRASOUND-PRINTER-001','POC meters and diagnostic equipment','Sony ultrasound printer.','Refurbished printer for ultrasound imaging workflows.','150000.00','Unit','1 unit','{"equipment_type":"Ultrasound printer","condition":"Refurbished","brand":"Sony"}'),
  ('Two-Bottle Suction Machine (Yuwell 7A-23D)','CLINIC-SUCTION-YUWELL-7A23D-001','Clinic and hospital infrastructure','Yuwell 7A-23D suction machine.','Two-bottle suction machine for clinic and hospital environments.','30000.00','Unit','1 unit','{"equipment_type":"Suction machine","model":"Yuwell 7A-23D","configuration":"Two-bottle"}'),
  ('Patient Monitor','CLINIC-PATIENT-MONITOR-001','Clinic and hospital infrastructure','Patient monitor.','Patient monitoring equipment for clinical environments.','120000.00','Unit','1 unit','{"equipment_type":"Patient monitor"}'),
  ('Pedal Bin 30 Litres (Black - Non-hazardous)','CLINIC-BIN-BLACK-30L-001','Clinic and hospital infrastructure','30-litre black pedal bin.','Pedal bin for non-hazardous waste management.','3000.00','Unit','1 unit','{"equipment_type":"Pedal bin","capacity":"30 litres","colour":"Black","waste_category":"Non-hazardous"}'),
  ('Pedal Bin 30 Litres (Red - Biohazard)','CLINIC-BIN-RED-30L-001','Clinic and hospital infrastructure','30-litre red pedal bin.','Pedal bin for biohazard waste management.','3000.00','Unit','1 unit','{"equipment_type":"Pedal bin","capacity":"30 litres","colour":"Red","waste_category":"Biohazard"}'),
  ('Pedal Bin 30 Litres (Yellow - Infectious)','CLINIC-BIN-YELLOW-30L-001','Clinic and hospital infrastructure','30-litre yellow pedal bin.','Pedal bin for infectious waste management.','3000.00','Unit','1 unit','{"equipment_type":"Pedal bin","capacity":"30 litres","colour":"Yellow","waste_category":"Infectious"}'),
  ('Baby Bassinet','CLINIC-BASSINET-001','Clinic and hospital infrastructure','Baby bassinet.','Bassinet for use in maternity and clinical care environments.','50000.00','Unit','1 unit','{"equipment_type":"Baby bassinet"}'),
  ('Wardscreen (Fourfold, Imported)','CLINIC-WARDSCREEN-FOURFOLD-001','Clinic and hospital infrastructure','Imported fourfold wardscreen.','Fourfold privacy screen for wards and clinical spaces.','18500.00','Unit','1 unit','{"equipment_type":"Wardscreen","configuration":"Fourfold","origin":"Imported"}'),
  ('Stepping Stool','CLINIC-STEPPING-STOOL-001','Clinic and hospital infrastructure','Stepping stool.','Stepping stool for clinical, laboratory, or facility use.','8000.00','Unit','1 unit','{"equipment_type":"Stepping stool"}'),
  ('Examination Couch (Local)','CLINIC-EXAMINATION-COUCH-001','Clinic and hospital infrastructure','Locally made examination couch.','Examination couch for clinic and consultation rooms.','50000.00','Unit','1 unit','{"equipment_type":"Examination couch","origin":"Local"}'),
  ('Executive Leather Office Chair','CLINIC-OFFICE-CHAIR-001','Clinic and hospital infrastructure','Executive leather office chair.','Office chair for healthcare administration and facility workspaces.','25000.00','Unit','1 unit','{"equipment_type":"Office chair","material":"Leather"}'),
  ('Drip Stand','CLINIC-DRIP-STAND-001','Clinic and hospital infrastructure','Drip stand.','Drip stand for clinical treatment and patient-care environments.','7000.00','Unit','1 unit','{"equipment_type":"Drip stand"}')
) as seed(title, sku, category, short_description, description, price, unit_of_sale, pack_size, attributes)
where not exists (
  select 1 from public.products existing where existing.sku = seed.sku
);
