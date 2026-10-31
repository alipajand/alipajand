# Open decisions

Owner decisions that block work. Each item has the recommended answer first. When an item is
decided, delete it here and record the outcome in the implementing PR; the code and its tests are
the lasting record. The longer analysis behind these items is in the history of `docs/decisions/`
and `docs/audits/` before this file replaced them.

No new owner decisions are needed. Two previously decided actions remain incomplete: an
owner-only Vercel privacy cleanup and restoring the GitHub main ruleset after a configuration drift.

Pending:

- **Delete the 62 old Vercel deployments that serve the originals.** Owner only; steps below. Not
  done until each URL returns 404 or 410 when signed in. Re-inventory before execution; the
  listed 62 IDs are a snapshot from 2026-10-31 and some may since have expired by retention.
- **Restore strict required CI checks on `main`.** Ruleset `15352584` is active, but
  `strict_required_status_checks_policy` was changed back to `false` at 2026-10-31 19:02 ET.
  The previously decided setting is `true`. Verify the reason for the intervening change
  before restoring it; see below.

Done and verified on 2026-10-31:

- **MapBylaw and TallyFolio design previews.** Their versions 1–5 held the unredacted MapBylaw
  dashboard and the unverified TallyFolio dashboard. Both records (`Ez5bX39cieti12y95JwNP9`,
  `PJzBMyJ9vQJ9u9Wpk4jiw9`) were deleted, which removes every version, and they no longer appear
  in the account's artifact list. New previews at new URLs replace them (see
  `docs/design/README.md`), and the 12 previews that linked to them were republished.
- **Concept previews from #214.** All three were deleted with their version history.
- **Branch protection (historical, not current).** Strict checks were enabled and
  read-back verified earlier on 2026-10-31, but the setting was subsequently reverted at 19:02 ET.
  Restoration is now tracked as pending above.

## Restore up-to-date required checks on main

**Decided:** enforce up-to-date branches before merging; do not alter the two existing required
check contexts or any other ruleset setting.

**Observed at 2026-10-31 19:02 ET:** the live, active `main` ruleset `15352584` has
`strict_required_status_checks_policy: false`, despite the earlier verified enablement.
GitHub's ruleset `updated_at` is `2026-10-31T19:02:24.236-04:00`. The reason for the
intervening administrative change is unverified.

To complete:

1. Confirm whether an authorized administrator deliberately reverted strict checks for
   an ongoing change. Do not silently overwrite that action or unrelated concurrent settings.
2. If no overriding decision exists, change only `strict_required_status_checks_policy` to
   `true` under Settings → Rules → Rulesets → `main` → Require status checks to pass.
3. Read back the live ruleset; verify strict mode is true and every other rule, required
   check context, integration ID, enforcement state, and bypass actor is unchanged.
4. Remove this pending item only after read-back verification. The required checks remain
   `Lint, typecheck, test, build` and `Playwright e2e (Chromium, Linux)`.

This is an external configuration action, not a repository-file change. An edited decision
register alone does not fix the protection gap.

## Delete the old Vercel deployments that serve the original screenshots

Decided: delete them, by deployment ID only. History is not rewritten.

Checked on 2026-10-31 against Vercel's own deployment list for the `alipajand` project (team
`pajand`). The list has 160 deployments, all ready production builds of `main` created from
2026-10-02 on. 62 of them still serve the original `/portfolio-media/ledgerguard-dashboard.png` and
`/portfolio-media/mapbylaw-dashboard.png`: each was fetched through a short-lived share link, and
both files matched the originals byte for byte. Every share link used for the check has been
revoked or has expired. The other 98 were built from commits without either file.

- **Production is clean.** `alipajand.com`, `alipajand-pajand.vercel.app` and
  `alipajand-git-main-pajand.vercel.app` point to `dpl_28d4dduFpxadm4UeVrdHkZiumLK3` (`e433d6e`),
  which has neither file. On `alipajand.com` both paths return 404. No alias in the team points to
  any of the 62.
- **They are behind sign-in.** Without it they redirect to Vercel SSO. Deleting them is still the
  decision.
- **Retention would remove them too.** The project keeps production deployments for 30 days, so
  the newest of the 62 (2026-10-27) expires around 2026-11-26. Deleting them now is sooner.
- **Vercel can restore a deleted deployment for 30 days**, whether it was deleted by hand or by
  retention, so the owner can recover the originals for that long.

Owner steps, from a shell signed in to the `pajand` team:

1. Confirm the three production aliases still point to `dpl_28d4dduFpxadm4UeVrdHkZiumLK3` or to a
   newer deployment.
2. Delete the 62 by ID. `--safe` skips any deployment that holds an alias:

   ```bash
   npx vercel@65.9.0 remove --safe --yes --scope pajand \
   dpl_2fgaLsSjxBdtPV7ttk3JPGFhwA5n \
   dpl_6yZKF33vVHF8GoR8922CQbNwARac \
   dpl_2hnVWX6k2agymKoPXBdmERGqPJPc \
   dpl_H6m7Pkk5FtNKpe179wTobc2M48dU \
   dpl_5EJ9kXt9x3hKeXXC7fQkP2hk8PQD \
   dpl_12E6FepTBRYhvWYTZgmcsa85zTSR \
   dpl_AMwhabD55v2CBj4wuxxj61mVHQNe \
   dpl_FbxscYRB68M37sFvCe8tkU3ZQEwQ \
   dpl_H5NmJ8UJaSsi1h5My4fBV7cLHxft \
   dpl_2zEtbWSysNWrNoknW7B1WtAHwXqy \
   dpl_GaN6NQBdDDceq3Hq7HHpceV3uEQ4 \
   dpl_2XgAU5Caxs5XFaoK5TQN2AWAaA7y \
   dpl_7MkPUP6R9NKm3kM9qEfS1Hc3zBGU \
   dpl_BcCyhAzGmszG3YzLLa4MJj4qbv5E \
   dpl_Ff3qqsxW6Sbeeee5J7o4bhQZkeDF \
   dpl_H4iknuWiEFBdXLuvS2cVDx9ZMczf \
   dpl_9D35iGmuKjrWiqXyg46uCik8gozm \
   dpl_3YZzpQzVnyVNHUUEduz7ERTMmXjG \
   dpl_CzLGzPNHi4hDRTaWQ6rAuxCMCiF5 \
   dpl_DkjtMU8JU83uiQgE2QqeUtWu1yVm \
   dpl_8LaB94Ndrdz1jUpc7zS7prJavWdN \
   dpl_CtxvhVSsXh8vLgWG37RriEgomEdu \
   dpl_HNvSu386rhGkQjQTZAQAbwhoTTG2 \
   dpl_ETevBRPaSqTAZ7faxkbG9wv3yEXh \
   dpl_GtjxA7WSCNBmjMKLUVXm5ZChiZhY \
   dpl_9Z2UF2hTJcaWkN3AmPpJAareC8fC \
   dpl_EmifZv9RvPJR4mkc5XhSsA8ChNyy \
   dpl_FBLxZ343fz8mc9fZSUEWgQngvzMZ \
   dpl_EEaUjd72ktxWZvK6x2GuLDP3XKG4 \
   dpl_Bi5etfF2tCpNdJCivLd7rMNfbkW9 \
   dpl_H4WWFGSDKCtAG3KCAbgkC7zzoUiS \
   dpl_Eq4HKwDDUQxsieq3SX9JG5K4BJ8f \
   dpl_6Y4U4bdXcGbRHUgbGKxzKgCu3H6H \
   dpl_CKZcKxne4th488fuStptGBP4Qm5i \
   dpl_HEwXE8jmZ38D8BtCxHEz2WXzD6Ku \
   dpl_PTN8KryhEGnaWSCyahu5z9zxFE6Q \
   dpl_7WkQEE6oHwWtQjm5mJgBWVALtRiz \
   dpl_H3mqrvJPaDCXeizaBZC4r9dT9mzW \
   dpl_5LUCWrjkVLHNrsJCtsYr7kaJJMRR \
   dpl_9XzM76GRH9q9HPWrYgJHXunjWzkc \
   dpl_Ctu17D5yGC2FDj5pvfwK42bozS9T \
   dpl_4vuJJiZC32PAj3xikR81f3eX4qKN \
   dpl_EtVhHPL7poQqjsujYufyQTEEJxU6 \
   dpl_6PMMWVfTsCatkeK6bq6hm9q7exb5 \
   dpl_u4tvWpZojbT6KTdtJksvkgpuakca \
   dpl_64VGAPxtJQZjatanDNf2LghayA55 \
   dpl_2jQUXuFLpaPREPwDgyjRqiRw2R2s \
   dpl_3qSuccc59h8mspXNhwvV7gkrYmAf \
   dpl_8ZwHnti72bjc89i3feoADTgcxRyv \
   dpl_TVt8KajYaqHyLLcS82ojv6qPEqgv \
   dpl_wqPqukt67hrvxTV4MGXkrzKoSzMS \
   dpl_JE1ivBK37XEZQkdE9HzPQKpR2nxv \
   dpl_7owGW3t6rcJkgsQgEJBYbKtKSb2r \
   dpl_3JeWC7SpcfuMFLr8Vm1rJ5KtYTNE \
   dpl_6EMJFiUhNkav6EMDXZRQFfWmmgTy \
   dpl_Da1Wrfq34MxRLeXw7wevzS6464hg \
   dpl_14qQ5RWrTkNGUYrsQYgym7AGjBie \
   dpl_2E8Q3YDhMW6B4XF2jvn55oMa4pN8 \
   dpl_35UzD9fFstZSUBxBLAUtEmbqMvvi \
   dpl_GS9wWxutCkP3SZBuYb2ZLkDwf4Ud \
   dpl_43ACq1ExPaoWrFRUcD9beBorzobw \
   dpl_99dwfVhegXQef15eZ1MXW6hFnkdM
   ```

3. Check that each URL in the table returns 404 or 410, not a 302 to sign-in. A redirect is not
   proof of deletion.
4. Check that `https://alipajand.com/portfolio` returns 200 and
   `https://alipajand.com/portfolio-media/ledgerguard-dashboard.png` returns 404.
5. Delete this section in a PR.

<details><summary>The 62 deployments (all ready, production, no alias)</summary>

| Created (UTC)    | Deployment ID                      | URL                                           | Commit    |
| ---------------- | ---------------------------------- | --------------------------------------------- | --------- |
| 2026-10-02 23:16 | `dpl_2fgaLsSjxBdtPV7ttk3JPGFhwA5n` | https://alipajand-mraeq5wfm-pajand.vercel.app | `d532550` |
| 2026-10-02 23:20 | `dpl_6yZKF33vVHF8GoR8922CQbNwARac` | https://alipajand-60j2c0np8-pajand.vercel.app | `7a98f2c` |
| 2026-10-03 00:45 | `dpl_2hnVWX6k2agymKoPXBdmERGqPJPc` | https://alipajand-qsb3r95rl-pajand.vercel.app | `73d24e2` |
| 2026-10-05 18:15 | `dpl_H6m7Pkk5FtNKpe179wTobc2M48dU` | https://alipajand-2znqw8848-pajand.vercel.app | `5aa308a` |
| 2026-10-05 18:15 | `dpl_5EJ9kXt9x3hKeXXC7fQkP2hk8PQD` | https://alipajand-i86sknt3e-pajand.vercel.app | `dcefe3c` |
| 2026-10-05 18:15 | `dpl_12E6FepTBRYhvWYTZgmcsa85zTSR` | https://alipajand-o4ywoinwj-pajand.vercel.app | `90fe112` |
| 2026-10-07 16:00 | `dpl_AMwhabD55v2CBj4wuxxj61mVHQNe` | https://alipajand-c5o6ohffj-pajand.vercel.app | `dcefe3c` |
| 2026-10-07 16:01 | `dpl_FbxscYRB68M37sFvCe8tkU3ZQEwQ` | https://alipajand-6akhh4tax-pajand.vercel.app | `c72fb7f` |
| 2026-10-07 20:43 | `dpl_H5NmJ8UJaSsi1h5My4fBV7cLHxft` | https://alipajand-7jb2ij5yj-pajand.vercel.app | `961d424` |
| 2026-10-08 16:51 | `dpl_2zEtbWSysNWrNoknW7B1WtAHwXqy` | https://alipajand-fqf784463-pajand.vercel.app | `06a1dde` |
| 2026-10-08 16:52 | `dpl_GaN6NQBdDDceq3Hq7HHpceV3uEQ4` | https://alipajand-gkh5hvdqu-pajand.vercel.app | `f182de9` |
| 2026-10-08 16:52 | `dpl_2XgAU5Caxs5XFaoK5TQN2AWAaA7y` | https://alipajand-nmujepn7l-pajand.vercel.app | `b8ea4a2` |
| 2026-10-08 16:53 | `dpl_7MkPUP6R9NKm3kM9qEfS1Hc3zBGU` | https://alipajand-hugjmcpw1-pajand.vercel.app | `402de90` |
| 2026-10-08 19:00 | `dpl_BcCyhAzGmszG3YzLLa4MJj4qbv5E` | https://alipajand-dl3tqtboj-pajand.vercel.app | `a6f5eec` |
| 2026-10-08 19:20 | `dpl_Ff3qqsxW6Sbeeee5J7o4bhQZkeDF` | https://alipajand-9mv087xjn-pajand.vercel.app | `c8d8461` |
| 2026-10-08 23:16 | `dpl_H4iknuWiEFBdXLuvS2cVDx9ZMczf` | https://alipajand-m625h06k8-pajand.vercel.app | `4a59afc` |
| 2026-10-08 23:26 | `dpl_9D35iGmuKjrWiqXyg46uCik8gozm` | https://alipajand-m92f2s3ms-pajand.vercel.app | `4829d55` |
| 2026-10-08 23:46 | `dpl_3YZzpQzVnyVNHUUEduz7ERTMmXjG` | https://alipajand-15m9lhvgk-pajand.vercel.app | `a15dcb0` |
| 2026-10-08 23:48 | `dpl_CzLGzPNHi4hDRTaWQ6rAuxCMCiF5` | https://alipajand-oolqbjy3e-pajand.vercel.app | `9882fc4` |
| 2026-10-13 22:56 | `dpl_DkjtMU8JU83uiQgE2QqeUtWu1yVm` | https://alipajand-cfwf7wxcx-pajand.vercel.app | `d05cb36` |
| 2026-10-13 22:57 | `dpl_8LaB94Ndrdz1jUpc7zS7prJavWdN` | https://alipajand-p3cxzvc9y-pajand.vercel.app | `64a7371` |
| 2026-10-15 15:06 | `dpl_CtxvhVSsXh8vLgWG37RriEgomEdu` | https://alipajand-3dtrghvfq-pajand.vercel.app | `b3cc374` |
| 2026-10-15 15:06 | `dpl_HNvSu386rhGkQjQTZAQAbwhoTTG2` | https://alipajand-mtpi54vya-pajand.vercel.app | `3a4fa6a` |
| 2026-10-15 15:39 | `dpl_ETevBRPaSqTAZ7faxkbG9wv3yEXh` | https://alipajand-3of39zp38-pajand.vercel.app | `988004c` |
| 2026-10-17 01:43 | `dpl_GtjxA7WSCNBmjMKLUVXm5ZChiZhY` | https://alipajand-1eqx8ckyz-pajand.vercel.app | `728171b` |
| 2026-10-19 18:01 | `dpl_9Z2UF2hTJcaWkN3AmPpJAareC8fC` | https://alipajand-dju04h8kb-pajand.vercel.app | `f2b0357` |
| 2026-10-20 13:34 | `dpl_EmifZv9RvPJR4mkc5XhSsA8ChNyy` | https://alipajand-oltkjtff7-pajand.vercel.app | `f239ebd` |
| 2026-10-20 13:36 | `dpl_FBLxZ343fz8mc9fZSUEWgQngvzMZ` | https://alipajand-7vzwsutda-pajand.vercel.app | `e803476` |
| 2026-10-20 13:36 | `dpl_EEaUjd72ktxWZvK6x2GuLDP3XKG4` | https://alipajand-c0ld3g075-pajand.vercel.app | `d66a914` |
| 2026-10-20 13:36 | `dpl_Bi5etfF2tCpNdJCivLd7rMNfbkW9` | https://alipajand-msiy48xqw-pajand.vercel.app | `0287142` |
| 2026-10-20 13:42 | `dpl_H4WWFGSDKCtAG3KCAbgkC7zzoUiS` | https://alipajand-2defw57jt-pajand.vercel.app | `ba8081b` |
| 2026-10-20 14:31 | `dpl_Eq4HKwDDUQxsieq3SX9JG5K4BJ8f` | https://alipajand-7zhn9om12-pajand.vercel.app | `ba8081b` |
| 2026-10-20 14:39 | `dpl_6Y4U4bdXcGbRHUgbGKxzKgCu3H6H` | https://alipajand-2h6y2xoza-pajand.vercel.app | `6f43749` |
| 2026-10-27 00:34 | `dpl_CKZcKxne4th488fuStptGBP4Qm5i` | https://alipajand-5ichq75tr-pajand.vercel.app | `30a761e` |
| 2026-10-27 01:09 | `dpl_HEwXE8jmZ38D8BtCxHEz2WXzD6Ku` | https://alipajand-cuqe85khi-pajand.vercel.app | `2947c5c` |
| 2026-10-27 01:09 | `dpl_PTN8KryhEGnaWSCyahu5z9zxFE6Q` | https://alipajand-fsp8yt8l7-pajand.vercel.app | `7da7c27` |
| 2026-10-27 01:09 | `dpl_7WkQEE6oHwWtQjm5mJgBWVALtRiz` | https://alipajand-hbpqqbn0l-pajand.vercel.app | `5738a11` |
| 2026-10-27 01:10 | `dpl_H3mqrvJPaDCXeizaBZC4r9dT9mzW` | https://alipajand-l254qxr5o-pajand.vercel.app | `7ecf924` |
| 2026-10-27 01:10 | `dpl_5LUCWrjkVLHNrsJCtsYr7kaJJMRR` | https://alipajand-mi3f24awp-pajand.vercel.app | `8df2ce6` |
| 2026-10-27 19:21 | `dpl_9XzM76GRH9q9HPWrYgJHXunjWzkc` | https://alipajand-4xfkcz39k-pajand.vercel.app | `faaee38` |
| 2026-10-27 19:24 | `dpl_Ctu17D5yGC2FDj5pvfwK42bozS9T` | https://alipajand-2qr3brben-pajand.vercel.app | `4cb5a7c` |
| 2026-10-27 19:24 | `dpl_4vuJJiZC32PAj3xikR81f3eX4qKN` | https://alipajand-4qoj8goz2-pajand.vercel.app | `8a01add` |
| 2026-10-27 19:28 | `dpl_EtVhHPL7poQqjsujYufyQTEEJxU6` | https://alipajand-nooukehee-pajand.vercel.app | `9bb96bb` |
| 2026-10-27 20:21 | `dpl_6PMMWVfTsCatkeK6bq6hm9q7exb5` | https://alipajand-38zjkq1k7-pajand.vercel.app | `780cd8f` |
| 2026-10-27 20:34 | `dpl_u4tvWpZojbT6KTdtJksvkgpuakca` | https://alipajand-lr1w6h2ek-pajand.vercel.app | `e98f3c5` |
| 2026-10-27 20:41 | `dpl_64VGAPxtJQZjatanDNf2LghayA55` | https://alipajand-cgd0aznpg-pajand.vercel.app | `22a33c2` |
| 2026-10-27 20:43 | `dpl_2jQUXuFLpaPREPwDgyjRqiRw2R2s` | https://alipajand-ft5hg6shk-pajand.vercel.app | `4a71def` |
| 2026-10-27 20:45 | `dpl_3qSuccc59h8mspXNhwvV7gkrYmAf` | https://alipajand-1ugdv3ua8-pajand.vercel.app | `d307b94` |
| 2026-10-27 20:45 | `dpl_8ZwHnti72bjc89i3feoADTgcxRyv` | https://alipajand-5r19mcz26-pajand.vercel.app | `03b0539` |
| 2026-10-27 20:48 | `dpl_TVt8KajYaqHyLLcS82ojv6qPEqgv` | https://alipajand-oifvsj3ta-pajand.vercel.app | `de3fe08` |
| 2026-10-27 20:49 | `dpl_wqPqukt67hrvxTV4MGXkrzKoSzMS` | https://alipajand-j5pdzj4fe-pajand.vercel.app | `2e03467` |
| 2026-10-27 21:07 | `dpl_JE1ivBK37XEZQkdE9HzPQKpR2nxv` | https://alipajand-dfop2op05-pajand.vercel.app | `8886f76` |
| 2026-10-27 21:07 | `dpl_7owGW3t6rcJkgsQgEJBYbKtKSb2r` | https://alipajand-hi293w2zw-pajand.vercel.app | `b46f180` |
| 2026-10-27 21:07 | `dpl_3JeWC7SpcfuMFLr8Vm1rJ5KtYTNE` | https://alipajand-kz2vahnr7-pajand.vercel.app | `4a932d3` |
| 2026-10-27 21:08 | `dpl_6EMJFiUhNkav6EMDXZRQFfWmmgTy` | https://alipajand-1juw8xodt-pajand.vercel.app | `49f5e2e` |
| 2026-10-27 21:10 | `dpl_Da1Wrfq34MxRLeXw7wevzS6464hg` | https://alipajand-irprmp1zl-pajand.vercel.app | `1e803fa` |
| 2026-10-27 21:12 | `dpl_14qQ5RWrTkNGUYrsQYgym7AGjBie` | https://alipajand-ke1irwpyi-pajand.vercel.app | `1b8b706` |
| 2026-10-27 21:20 | `dpl_2E8Q3YDhMW6B4XF2jvn55oMa4pN8` | https://alipajand-8joh94m6x-pajand.vercel.app | `9ad39e8` |
| 2026-10-27 21:21 | `dpl_35UzD9fFstZSUBxBLAUtEmbqMvvi` | https://alipajand-bn0w411ph-pajand.vercel.app | `6ec24ef` |
| 2026-10-27 21:29 | `dpl_GS9wWxutCkP3SZBuYb2ZLkDwf4Ud` | https://alipajand-p4wg4sixk-pajand.vercel.app | `81f45ef` |
| 2026-10-27 21:33 | `dpl_43ACq1ExPaoWrFRUcD9beBorzobw` | https://alipajand-mnosai27j-pajand.vercel.app | `eee6319` |
| 2026-10-27 21:40 | `dpl_99dwfVhegXQef15eZ1MXW6hFnkdM` | https://alipajand-pg4m39hh0-pajand.vercel.app | `bad0efe` |

</details>
