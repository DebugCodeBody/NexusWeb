select seq from mat.erp_mat_line where isdeal = true and issbo = true and cuttype = '标条'

  select m.* into vm 
  from mat.erp_mat_line m
  where m.seq=pseq;

  if vm is null or vm.seq is null then
    errmsg := '订单不存在.';
    return;
  end if;

  orderid := vm.ordid;
  if not coalesce(vm.isdeal,false) or not coalesce(vm.issbo,false) then
    errmsg := '非精板订单.';
    return;
  end if;