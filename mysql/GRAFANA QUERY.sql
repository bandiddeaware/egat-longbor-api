SELECT 
  "Summary Barrier" AS metric,
  IF(p_in IS NULL, 0,  p_in) AS Person_IN,

  IF(p_out IS NULL, 0, p_out) AS Person_OUT,

  IF(c_in IS NULL, 0, c_in) AS Vehicle_IN,

  IF(c_out IS NULL, 0, c_out) AS Vehicle_OUT

FROM (
SELECT
  "Person In " AS Name_Title_Proson_IN,
  SUM(IF(access_direction = 0 && access_type = 1 && entrance_id = 1, 1, 0)) AS p_in,
  "Person Out " AS Name_Title_Proson_OUT,
  SUM(IF(access_direction = 1 && access_type = 1 && entrance_id = 1, 1, 0)) AS p_out,
  "Vehicle In " AS Name_Title_Vehicle_IN,
  SUM(IF(access_direction = 0 && access_type = 2 && entrance_id = 1, 1, 0)) AS c_in,
  "Vehicle Out " AS Name_Title_Vehicle_OUT,
  SUM(IF(access_direction = 1 && access_type = 2 && entrance_id = 1, 1, 0)) AS c_out
FROM access_log
WHERE access_result = 0 AND $__timeFilter(access_time)
) AS filter_null

-- Variable Grafana format
-- คนเข้า : acl.access_direction = 0, คนออก : acl.access_direction = 1, คนเข้าและคนออก : (acl.access_direction = 0 OR acl.access_direction = 1)


-- // ================================================================================ //
-- // ================================================================================ //


SELECT 

  acl.access_time AS time,
  et.name AS entrace_name,
  acl.access_direction AS direction,
  acl.access_result AS access_result,
  acl.entrance_id AS station_id,
  acl.ch_type AS channel_id,
  card.id AS card_id,
  ps.firstname AS name,
  ps.lastname AS surname,
  pt.description AS card_type,
  cn.name AS company_name

FROM access_log as acl

LEFT JOIN person as ps
  ON acl.person_id = ps.id

LEFT JOIN company as cn
  ON ps.company_id = cn.id

LEFT JOIN card as card
  ON acl.card_id = card.id

LEFT JOIN person_type AS pt
  ON ps.type = pt.id

LEFT JOIN station as et
  ON et.id = acl.entrance_id

WHERE 
  ((acl.ch_type = 0 OR acl.ch_type = 1)) AND (acl.entrance_id = 2) AND

  $__timeFilter(acl.access_time)



-- list person in bor OLD
SELECT 

  person.id,
  person.idcard,
  person.firstname ,
  person.lastname,
  company.id,
  company.name,
  card_status.description,
  person_type.description,
  card.id,

  IF(person.asbp_checked_at > person.check_in_at, TRUE, FALSE),
  person.check_in_at,
  person.check_out_at,
  person.asbp_checked_at

FROM person

LEFT JOIN card
  ON person.card_id = card.id

LEFT JOIN person_type
  ON person.type = person_type.id

LEFT JOIN card_status
  ON card.status = card_status.id

LEFT JOIN company
  ON company.id = person.company_id

WHERE 
  ((person.check_in_at > person.check_out_at) OR (person.check_in_at IS NOT NULL AND person.check_out_at IS NULL)) AND 
  
  person.check_in_at IS NOT NULL AND 
  
  person.card_id IS NOT NULL








-- list person in bor NEW
SELECT 

  person.idcard,
  person.egat_person_code
  person.firstname ,
  person.lastname,
  company.name,
  person_type.description,
  IF(person.asbp_checked_at > person.check_in_at, "อยู่ในบ่อ", "ไม่ได้อยู่ในบ่อ") AS person_inbor

FROM person

LEFT JOIN card
  ON person.card_id = card.id

LEFT JOIN person_type
  ON person.type = person_type.id

LEFT JOIN card_status
  ON card.status = card_status.id

LEFT JOIN company
  ON company.id = person.company_id

WHERE 
  ((person.check_in_at > person.check_out_at) OR (person.check_in_at IS NOT NULL AND person.check_out_at IS NULL)) AND 
  
  person.check_in_at IS NOT NULL AND 
  
  person.card_id IS NOT NULL

  ORDER BY person.id DESC



IF(extract(month from access_log.access_time) = 8, "ส.ค.", 
  IF(extract(month from access_log.access_time) = 9), "ก.ย.", 
    IF(extract(month from access_log.access_time), "ต.ค.", ""))

    IF(condiction, true, false)




-- ด่านหลัก 1 
-- 18.343575
-- 99.738629

-- ด่านหลัก 2
-- 18.3103932483565
-- 99.709188518204

-- ด่านหลัก 3
-- 18.354215
-- 99.709808