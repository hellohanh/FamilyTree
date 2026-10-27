#!/usr/bin/env python3
"""Make a Trancestry edit code from a name and Hanh's secret phrase (Entry 134) — same recipe as tools/code-maker.html.
Usage: python3 tools/make_code.py "Bảo Nguyễn"   (asks for the phrase; it is never stored)"""
import hmac, hashlib, sys, unicodedata, re, getpass
ALPH = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
def slug(name):
    t = unicodedata.normalize('NFD', name)
    t = ''.join(c for c in t if unicodedata.category(c) != 'Mn').replace('đ', 'd').replace('Đ', 'd').lower()
    return re.sub(r'[^a-z0-9]', '', t)
def make_code(name, phrase):
    n = int.from_bytes(hmac.new(phrase.encode(), ('trancestry-code-v1|' + slug(name)).encode(), hashlib.sha256).digest(), 'big')
    out = ''
    for _ in range(6): out += ALPH[n % 31]; n //= 31
    return out
if __name__ == '__main__':
    name = sys.argv[1] if len(sys.argv) > 1 else input('Full name: ')
    print(slug(name), make_code(name, getpass.getpass('Secret phrase: ')))
