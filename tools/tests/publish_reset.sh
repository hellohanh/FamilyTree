#!/bin/sh
# Entry 201: fresh local copy of the family database from Hanh's 2026-10-29 backup (+ 10_link, 11_publish), family code FAM123
P="psql -h /var/tmp/hftpg -p 5499 -U postgres -d hft29 -v ON_ERROR_STOP=1 -q"
$P -f "$1" >/dev/null && $P -f supabase/10_link_son_trung_van.sql >/dev/null 2>&1 && $P -f supabase/11_publish.sql >/dev/null 2>&1 &&
$P -c "delete from photo_settings; insert into photo_settings(code_hash) values (crypt('FAM123',gen_salt('bf'))); delete from code_failures; delete from updates; update trees set published = link in ('hanh-maternal-grandpa','son-s-trung-van-paternal-grandparents');" && echo reset
